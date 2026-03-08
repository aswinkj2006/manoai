import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, StopCircle } from 'lucide-react';
import { AvatarViewer } from './AvatarViewer';

// Polyfill types for SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface BridgeModeProps {
    onClose: () => void;
}

export const BridgeMode: React.FC<BridgeModeProps> = ({ onClose }) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [currentWord, setCurrentWord] = useState('');
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                let currentTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const trans = event.results[i][0].transcript;
                    currentTranscript += trans;
                }
                setTranscript(currentTranscript);

                // Feed the last word to the avatar for animation
                const words = currentTranscript.trim().split(' ');
                if (words.length > 0) {
                    setCurrentWord(words[words.length - 1]);
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                // Auto-restart if it was supposed to be listening (avoids timeout disconnects)
                if (isListening && recognitionRef.current) {
                    try { recognitionRef.current.start() } catch (e) { }
                }
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
            setTranscript("Your browser doesn't support Speech API. Used Chrome/Edge.");
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setCurrentWord('');
        } else {
            setTranscript('');
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--color-bg)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, background: 'linear-gradient(90deg, var(--color-primary), var(--color-tertiary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    The Bridge
                </h2>
                <button onClick={onClose} className="btn-glass" style={{ padding: '8px' }}>
                    <X size={24} color="var(--color-text)" />
                </button>
            </div>

            <div style={{ padding: '0 20px', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                Point your phone at a hearing person's speech. Text and 3D sign translation will happen in real-time.
            </div>

            {/* Avatar Viewer */}
            <div style={{ flex: 1, padding: '0 20px', position: 'relative' }}>
                <AvatarViewer currentWord={currentWord} />
            </div>

            {/* Transcript Area */}
            <div style={{
                padding: '24px 20px',
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end'
            }}>
                <div className="glass-panel" style={{
                    padding: '20px',
                    fontSize: '1.2rem',
                    color: transcript ? 'var(--color-text)' : 'gray',
                    minHeight: '80px',
                    fontStyle: transcript ? 'normal' : 'italic',
                    marginBottom: '20px'
                }}>
                    {transcript || 'Awaiting speech input...'}
                </div>

                <button
                    className={`btn-glass ${isListening ? 'btn-rose' : 'btn-cyan'}`}
                    onClick={toggleListening}
                    style={{
                        width: '100%',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '1.2rem'
                    }}
                >
                    {isListening ? <StopCircle size={28} /> : <Mic size={28} />}
                    {isListening ? 'STOP TRANSLATING' : 'START LIVE CAPTION'}
                </button>
            </div>
        </div>
    );
};
