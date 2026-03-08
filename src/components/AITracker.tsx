import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
    HandLandmarker,
    FaceLandmarker,
    FilesetResolver,
    DrawingUtils
} from '@mediapipe/tasks-vision';
import fp from 'fingerpose';
import { ASLGestures } from '../utils/ASLGestures';

interface AITrackerProps {
    targetSign?: string;
    isQuestion?: boolean;
    onSuccess?: () => void;
    referenceVisual?: string;
}

export const AITracker: React.FC<AITrackerProps> = ({ targetSign, isQuestion, onSuccess, referenceVisual }) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [feedback, setFeedback] = useState<string>('Initializing AI Trackers...');

    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const requestRef = useRef<number>(0);

    // Track success internally to avoid multiple triggers
    const successTriggered = useRef(false);

    const initModels = async () => {
        try {
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            handLandmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 2
            });

            faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                outputFaceBlendshapes: true,
                numFaces: 1
            });

            setIsLoaded(true);
            setFeedback('Ready. Show your hands & face.');
        } catch (e) {
            console.error("Error loading MediaPipe models:", e);
            setFeedback('Failed to load AI models. Please check connection.');
        }
    };

    useEffect(() => {
        initModels();
        return () => {
            cancelAnimationFrame(requestRef.current);
            handLandmarkerRef.current?.close();
            faceLandmarkerRef.current?.close();
        };
    }, []);

    const detect = useCallback(() => {
        if (
            !webcamRef.current ||
            !canvasRef.current ||
            !handLandmarkerRef.current ||
            !faceLandmarkerRef.current ||
            !webcamRef.current.video
        ) {
            requestRef.current = requestAnimationFrame(detect);
            return;
        }

        const video = webcamRef.current.video;
        if (video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(detect);
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Match canvas width/height to video element
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const nowInMs = performance.now();
        let handCorrect = false;
        let faceCorrect = true; // Default true if no face rule
        let currentFeedback = 'Tracking...';
        let drawColor = '#00ffff';

        try {
            // 1. Hand Tracking
            const handResults = handLandmarkerRef.current.detectForVideo(video, nowInMs);
            const drawingUtils = new DrawingUtils(ctx);

            if (handResults.landmarks.length > 0) {
                for (const landmarks of handResults.landmarks) {
                    // Draw standard connections
                    drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                        color: drawColor,
                        lineWidth: 3
                    });
                    drawingUtils.drawLandmarks(landmarks, { color: '#ff0055', lineWidth: 2, radius: 4 });
                }

                if (targetSign) {
                    const letter = targetSign.toUpperCase();
                    // MediaPipe landmarks are normalized [0, 1]. Fingerpose expects screen coordinates for accurate slope math.
                    const fpLandmarks = handResults.landmarks[0].map(lm => [
                        lm.x * canvas.width,
                        lm.y * canvas.height,
                        lm.z * canvas.width
                    ]);

                    const GE = new fp.GestureEstimator(ASLGestures);
                    // 7.5 minimum confidence out of 10
                    const estimated = GE.estimate(fpLandmarks, 7.5);

                    if (estimated.gestures.length > 0) {
                        // Find gesture with highest score
                        const bestMatch = estimated.gestures.reduce((p: any, c: any) => p.score > c.score ? p : c);

                        if (bestMatch.name === letter) {
                            handCorrect = true;
                        } else {
                            currentFeedback = `Seeing ${bestMatch.name}, adjust to ${letter}`;
                            drawColor = '#ff8800'; // Orange
                        }
                    } else {
                        currentFeedback = `Form the sign for ${letter}...`;
                        drawColor = '#ff0000'; // Red
                    }
                } else {
                    // No target sign to check hand shape, just verify hand is present
                    handCorrect = true;
                }
            } else {
                currentFeedback = 'No hands detected.';
            }

            // 2. Face/Expression Tracking
            if (isQuestion) {
                faceCorrect = false; // Require eyebrows raised
                const faceResults = faceLandmarkerRef.current.detectForVideo(video, nowInMs);
                if (faceResults.faceBlendshapes && faceResults.faceBlendshapes.length > 0) {
                    const shapes = faceResults.faceBlendshapes[0].categories;
                    // Look for browInnerUp blendshape
                    const browUp = shapes.find(s => s.categoryName === 'browInnerUp');
                    if (browUp && browUp.score > 0.4) {
                        faceCorrect = true;
                    } else {
                        currentFeedback = 'Eyebrows up for questions! (SL Grammar)';
                    }
                }
            }

            if (handCorrect && faceCorrect && !successTriggered.current) {
                currentFeedback = 'Perfect! Holding...';
                drawColor = '#00ff00';
                successTriggered.current = true; // prevent re-triggering

                // Fire success once after minimal hold time
                setTimeout(() => {
                    if (onSuccess) onSuccess();
                }, 1000);
            }

            setFeedback(currentFeedback);
        } catch (err) {
            console.error(err);
        }

        requestRef.current = requestAnimationFrame(detect);
    }, [isLoaded, targetSign, isQuestion, onSuccess]);

    useEffect(() => {
        if (isLoaded) {
            requestRef.current = requestAnimationFrame(detect);
        }
    }, [isLoaded, detect]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden' }}>
            {!isLoaded && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface)', zIndex: 10 }}>
                    <div className="spinner" style={{ border: '4px solid var(--color-primary)', borderTop: '4px solid transparent', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            <Webcam
                ref={webcamRef}
                audio={false}
                videoConstraints={{ facingMode: "user" }}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)' // Mirror
                }}
                onUserMediaError={() => setFeedback("Webcam access denied.")}
            />

            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)', // Mirror matching webcam
                    zIndex: 5,
                }}
            />

            {/* Scanner HUD Overlay */}
            {isLoaded && !successTriggered.current && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    pointerEvents: 'none',
                    zIndex: 8,
                    background: 'linear-gradient(to bottom, rgba(0,229,255,0) 0%, rgba(0,229,255,0.1) 50%, rgba(0,229,255,0) 100%)',
                    backgroundSize: '100% 200%',
                    animation: 'scanLine 3s linear infinite'
                }}>
                    <style>{`
                        @keyframes scanLine {
                            0% { background-position: 0 -100%; }
                            100% { background-position: 0 200%; }
                        }
                    `}</style>
                    {/* HUD Corners */}
                    <div style={{ position: 'absolute', top: 16, left: 16, width: 20, height: 20, borderTop: '2px solid var(--color-primary)', borderLeft: '2px solid var(--color-primary)' }} />
                    <div style={{ position: 'absolute', top: 16, right: 16, width: 20, height: 20, borderTop: '2px solid var(--color-primary)', borderRight: '2px solid var(--color-primary)' }} />
                    <div style={{ position: 'absolute', bottom: 16, left: 16, width: 20, height: 20, borderBottom: '2px solid var(--color-primary)', borderLeft: '2px solid var(--color-primary)' }} />
                    <div style={{ position: 'absolute', bottom: 16, right: 16, width: 20, height: 20, borderBottom: '2px solid var(--color-primary)', borderRight: '2px solid var(--color-primary)' }} />
                </div>
            )}

            {/* Reference Image Container (pics of signs) */}
            {referenceVisual && (
                <div style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    padding: '8px 12px',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reference</span>
                    <span style={{ fontSize: '2.5rem' }}>{referenceVisual}</span>
                </div>
            )}

            <div style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.2)',
                zIndex: 10
            }}>
                {feedback}
            </div>
        </div>
    );
};
