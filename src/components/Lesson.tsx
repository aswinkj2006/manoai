import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, MonitorPlay, BookOpen, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { COURSE_DATA } from '../data/course';
import { useAppStore } from '../store';
import confetti from 'canvas-confetti';
import { AITracker } from './AITracker';
import { AvatarViewer } from './AvatarViewer';

interface LessonProps {
    lessonId: string;
    onClose: () => void;
    onComplete: (lessonId: string) => void;
}

export const Lesson: React.FC<LessonProps> = ({ lessonId, onClose, onComplete }) => {
    const lessonData = COURSE_DATA[lessonId];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [hearts, setHearts] = useState(3);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showVideo, setShowVideo] = useState(false);

    // If lesson doesn't exist, just close
    useEffect(() => {
        if (!lessonData) {
            onClose();
        }
    }, [lessonData, onClose]);

    if (!lessonData) return null;

    const currentQuestion = lessonData.questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / lessonData.questions.length) * 100;

    const handleCheck = () => {
        if (selectedAnswer === null) return;

        const correctOption = currentQuestion.options?.find(o => o.isCorrect);
        const correct = correctOption?.id === selectedAnswer;

        setIsCorrect(correct);
        setShowResult(true);

        if (!correct) {
            setHearts(Math.max(0, hearts - 1));
        }
    };

    const handleProceedToNext = () => {
        if (currentQuestionIndex < lessonData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowResult(false);
            setSelectedAnswer(null);
            setIsCorrect(false);
            setShowVideo(false);
        } else {
            // Lesson complete logic
            const { addXp, unlockAchievement, completeLesson } = useAppStore.getState();
            addXp(lessonData.xp ?? 100);
            completeLesson();

            // Vibrate on success
            if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);

            // Explode confetti
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#00e5ff', '#ff0055', '#7000ff']
            });

            // Grant achievement based on lesson
            if (lessonId === 'lesson-a-c') unlockAchievement('first-steps');

            setTimeout(() => onComplete(lessonId), 1500); // delay close for confetti
        }
    };

    const handleNext = () => {
        setShowResult(false);
        setSelectedAnswer(null);

        // If out of hearts, lesson fails
        if (hearts <= 0) {
            onClose(); // In a real app, show a "Failed" screen
            return;
        }

        // Move to next question or complete lesson
        if (isCorrect) {
            handleProceedToNext();
        }
    };

    const handleAISuccess = () => {
        setIsCorrect(true);
        setShowResult(true);
    };

    const correctOptionText = currentQuestion.options?.find(o => o.isCorrect)?.text || 'AI Tracker Complete';

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: 'var(--color-bg)',
            position: 'relative',
        }}>
            {/* Top Bar / Progress */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '24px 20px',
                gap: '16px',
            }}>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        color: 'var(--color-text-muted)',
                        transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                    <X size={28} />
                </button>

                {/* Progress Bar Container */}
                <div className="glass-panel" style={{
                    flex: 1,
                    height: '16px',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    padding: '0', // override glass-panel padding if any
                }}>
                    {/* Progress Fill */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                            borderRadius: 'var(--radius-full)',
                            position: 'relative',
                            boxShadow: '0 0 15px var(--color-primary-glow)'
                        }}>
                    </motion.div>
                </div>

                <motion.div
                    animate={hearts < 3 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-secondary)', fontWeight: 700 }}
                >
                    <Heart size={20} fill="currentColor" />
                    <span style={{ fontSize: '1.2rem', textShadow: '0 0 10px var(--color-secondary-glow)' }}>{hearts}</span>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <div style={{
                flex: 1,
                padding: '0 20px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
            }}>
                {/* INFO CARD TYPE */}
                {currentQuestion.type === 'info' ? (
                    <motion.div
                        key={`info-${currentQuestion.id}`}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-panel"
                        style={{
                            flex: 1,
                            margin: '0 0 20px',
                            padding: '40px 28px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            gap: '20px',
                            border: '1px solid var(--color-primary)',
                            background: 'rgba(0, 229, 255, 0.05)',
                        }}
                    >
                        <div style={{
                            width: '72px', height: '72px',
                            borderRadius: '18px',
                            background: 'rgba(0, 229, 255, 0.12)',
                            border: '1px solid rgba(0, 229, 255, 0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.2rem',
                        }}>
                            {currentQuestion.visual}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)' }}>
                            <BookOpen size={16} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Lesson Intro</span>
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text)', lineHeight: 1.2 }}>
                            {currentQuestion.text}
                        </h2>
                        <p style={{
                            fontSize: '1rem',
                            color: 'var(--color-text-muted)',
                            lineHeight: 1.7,
                            maxWidth: '480px',
                        }}>
                            {currentQuestion.info}
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="btn-glass btn-cyan"
                            style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={handleProceedToNext}
                        >
                            LET'S GO <ChevronRight size={18} />
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '20px', textAlign: 'center', lineHeight: 1.4 }}>
                            {currentQuestion.text}
                        </h2>

                        {/* Visual Cue or AI Tracker */}
                        {currentQuestion.type === 'ai-interactive' ? (
                            <motion.div
                                key={`${currentQuestion.id}-interactive`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '16px',
                                    height: '60vh',
                                    marginBottom: '16px'
                                }}
                            >
                                <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: 0, border: '2px solid var(--color-primary)' }}>
                                    <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, display: 'flex', gap: '8px' }}>
                                        <div style={{ background: 'rgba(0,229,255,0.2)', padding: '4px 12px', borderRadius: '12px', color: 'var(--color-primary)', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                                            1. Study the Sign
                                        </div>
                                        {currentQuestion.youtubeId && (
                                            <button
                                                onClick={() => setShowVideo(!showVideo)}
                                                style={{
                                                    background: showVideo ? 'var(--color-primary)' : 'rgba(0,0,0,0.5)',
                                                    padding: '4px 12px',
                                                    borderRadius: '12px',
                                                    color: showVideo ? '#000' : 'var(--color-primary)',
                                                    fontWeight: 'bold',
                                                    backdropFilter: 'blur(4px)',
                                                    border: '1px solid var(--color-primary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <MonitorPlay size={16} /> {showVideo ? 'Return to 3D' : 'Watch Video'}
                                            </button>
                                        )}
                                    </div>

                                    {showVideo && currentQuestion.youtubeId ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${currentQuestion.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${currentQuestion.youtubeId.replace('v=', '')}`}
                                            title="YouTube video player"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            style={{ border: 'none', background: '#000' }}
                                        ></iframe>
                                    ) : (
                                        <AvatarViewer currentWord={currentQuestion.signWord || ''} />
                                    )}
                                </div>
                                <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: 0, border: '2px solid var(--color-secondary)' }}>
                                    <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'rgba(255,0,85,0.2)', padding: '4px 12px', borderRadius: '12px', color: 'var(--color-secondary)', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                                        2. Try it Yourself!
                                    </div>
                                    <AITracker targetSign={currentQuestion.targetSign} referenceVisual={currentQuestion.visual} onSuccess={handleAISuccess} />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="glass-panel" style={{
                                width: '100%',
                                height: (currentQuestion.type === 'ai-practice' || currentQuestion.signWord) ? '60vh' : '240px',
                                marginBottom: (currentQuestion.type === 'ai-practice' || currentQuestion.signWord) ? '16px' : '32px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '4rem',
                                padding: (currentQuestion.type === 'ai-practice' || currentQuestion.signWord) ? '0' : '24px',
                                overflow: 'hidden'
                            }}>
                                <motion.div
                                    key={currentQuestion.id} // Animate when question changes
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: 'spring', bounce: 0.5 }}
                                    style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    {currentQuestion.type === 'ai-practice' ? (
                                        <AITracker
                                            targetSign={currentQuestion.targetSign}
                                            isQuestion={currentQuestion.isQuestion}
                                            onSuccess={handleAISuccess}
                                            referenceVisual={currentQuestion.targetSign}
                                        />
                                    ) : currentQuestion.signWord ? (
                                        <AvatarViewer currentWord={currentQuestion.signWord} />
                                    ) : (
                                        currentQuestion.visual
                                    )}
                                </motion.div>
                            </div>
                        )}

                        {/* Options Grid — visual sign cards or text buttons */}
                        {currentQuestion.type !== 'ai-practice' && currentQuestion.type !== 'ai-interactive' && (
                            (() => {
                                const hasSignOptions = currentQuestion.options?.every(o => o.signWord);
                                if (hasSignOptions) {
                                    // ── VISUAL SIGN OPTIONS (2×2 grid of mini 3D hand models) ──
                                    return (
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '12px',
                                            marginTop: '4px',
                                        }}>
                                            {currentQuestion.options?.map((option, i) => {
                                                const isSelected = selectedAnswer === option.id;
                                                let borderColor = 'var(--color-border)';
                                                let bg = 'var(--color-surface)';
                                                let glow = 'none';
                                                if (showResult) {
                                                    if (option.isCorrect) { borderColor = 'var(--color-success)'; bg = 'rgba(16,185,129,0.08)'; glow = '0 0 16px rgba(16,185,129,0.3)'; }
                                                    else if (isSelected) { borderColor = 'var(--color-secondary)'; bg = 'rgba(255,0,85,0.08)'; }
                                                } else if (isSelected) {
                                                    borderColor = 'var(--color-primary)';
                                                    bg = 'var(--color-surface-active)';
                                                    glow = '0 0 20px var(--color-primary-glow)';
                                                }
                                                return (
                                                    <motion.button
                                                        key={option.id}
                                                        initial={{ opacity: 0, scale: 0.92 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.08 }}
                                                        whileHover={!showResult ? { y: -3, scale: 1.02 } : {}}
                                                        whileTap={!showResult ? { scale: 0.97 } : {}}
                                                        onClick={() => !showResult && setSelectedAnswer(option.id)}
                                                        disabled={showResult}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            padding: '0',
                                                            border: `2px solid ${borderColor}`,
                                                            borderRadius: '16px',
                                                            background: bg,
                                                            cursor: showResult ? 'default' : 'pointer',
                                                            overflow: 'hidden',
                                                            boxShadow: glow,
                                                            transition: 'all 0.2s',
                                                            height: '190px',
                                                            position: 'relative',
                                                        }}
                                                    >
                                                        {/* Mini 3D hand model — takes up most of the card */}
                                                        <div style={{ flex: 1, width: '100%', pointerEvents: 'none' }}>
                                                            <AvatarViewer currentWord={option.signWord!} />
                                                        </div>
                                                        {/* Letter label at bottom */}
                                                        <div style={{
                                                            width: '100%',
                                                            padding: '8px 0',
                                                            textAlign: 'center',
                                                            fontWeight: 800,
                                                            fontSize: '1.1rem',
                                                            letterSpacing: '1px',
                                                            color: isSelected ? 'var(--color-primary)' : showResult && option.isCorrect ? 'var(--color-success)' : 'var(--color-text)',
                                                            background: 'rgba(0,0,0,0.4)',
                                                            backdropFilter: 'blur(4px)',
                                                            borderTop: `1px solid ${borderColor}30`,
                                                        }}>
                                                            {option.text}
                                                        </div>
                                                        {/* Checkmark overlay for correct answer when shown */}
                                                        {showResult && option.isCorrect && (
                                                            <div style={{
                                                                position: 'absolute', top: '8px', right: '8px',
                                                                width: '24px', height: '24px', borderRadius: '50%',
                                                                background: 'var(--color-success)',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                fontSize: '0.8rem',
                                                            }}>✓</div>
                                                        )}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    );
                                }
                                // ── TEXT OPTIONS (regular text buttons) ──
                                return (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                                        {currentQuestion.options?.map((option, i) => (
                                            <motion.button
                                                key={option.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                whileTap={!showResult ? { scale: 0.98 } : {}}
                                                onClick={() => !showResult && setSelectedAnswer(option.id)}
                                                disabled={showResult}
                                                className="glass-panel"
                                                style={{
                                                    padding: '16px 20px',
                                                    textAlign: 'left',
                                                    border: `1px solid ${selectedAnswer === option.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                                    background: selectedAnswer === option.id ? 'var(--color-surface-active)' : 'var(--color-surface)',
                                                    color: selectedAnswer === option.id ? 'var(--color-text)' : 'var(--color-text-muted)',
                                                    fontWeight: 500,
                                                    fontSize: '1rem',
                                                    cursor: showResult ? 'default' : 'pointer',
                                                    transition: 'all 0.2s',
                                                    boxShadow: selectedAnswer === option.id ? '0 0 20px var(--color-primary-glow)' : 'none',
                                                }}
                                            >
                                                {option.text}
                                            </motion.button>
                                        ))}
                                    </div>
                                );
                            })()
                        )}
                    </>
                )}
            </div>

            {/* Footer Area (Check Button / Result) */}
            <div style={{ position: 'relative' }}>
                <AnimatePresence>
                    {showResult && (
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                            className="glass-panel"
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '24px 20px',
                                paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
                                background: isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                                borderColor: isCorrect ? 'var(--color-success)' : 'var(--color-secondary)',
                                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                                borderBottom: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                zIndex: 10,
                                backdropFilter: 'blur(20px)',
                            }}
                        >
                            <div style={{
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                color: isCorrect ? 'var(--color-success)' : 'var(--color-secondary)',
                                fontWeight: 600,
                                fontSize: '1.2rem'
                            }}>
                                <div style={{
                                    background: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                    borderRadius: '50%',
                                    padding: '8px',
                                    display: 'flex'
                                }}>
                                    {isCorrect ? <Sparkles size={24} /> : <X size={24} />}
                                </div>
                                {isCorrect ? 'Excellent decoding!' : `Correct answer: ${correctOptionText}`}
                            </div>
                            <button
                                className={`btn-glass ${isCorrect ? 'btn-emerald' : 'btn-rose'}`}
                                onClick={isCorrect ? handleProceedToNext : handleNext}
                            >
                                {hearts <= 0 && !isCorrect ? 'TRY AGAIN LATER' : 'CONTINUE'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Regular Footer */}
                {!showResult && currentQuestion.type !== 'ai-practice' && currentQuestion.type !== 'ai-interactive' && currentQuestion.type !== 'info' && (
                    <div className="glass-panel" style={{
                        padding: '24px 20px',
                        borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                        borderBottom: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        background: 'rgba(9, 9, 11, 0.8)', // Darker background to separate from content
                    }}>
                        <button
                            className={`btn-glass ${selectedAnswer ? "btn-cyan" : ""}`}
                            style={{ opacity: selectedAnswer ? 1 : 0.5 }}
                            onClick={handleCheck}
                            disabled={!selectedAnswer}
                        >
                            VERIFY LOGIC
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
