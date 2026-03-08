import React from 'react';
import { COURSE_MODULES, COURSE_DATA, LESSON_ORDER } from '../data/course';
import { Lock, Play, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export interface LearningPathProps {
    completedLessons: string[];
    unlockedLessons: string[];
    onStartLesson: (lessonId: string) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({ completedLessons, unlockedLessons, onStartLesson }) => {

    const lessonsByModule = COURSE_MODULES.map(module => {
        const lessons = LESSON_ORDER
            .filter(id => COURSE_DATA[id].module === module.id)
            .map(id => COURSE_DATA[id]);
        return { ...module, lessons };
    });

    return (
        <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px',
            paddingBottom: '110px',
        }}>
            {lessonsByModule.map((module, mIndex) => {
                const totalLessons = module.lessons.length;
                const completedCount = module.lessons.filter(l => completedLessons.includes(l.id)).length;
                const moduleProgress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
                const isModuleComplete = completedCount === totalLessons && totalLessons > 0;

                return (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: mIndex * 0.08 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                    >
                        {/* Module Header */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '4px' }}>
                            {/* Icon Badge */}
                            <div style={{
                                width: '56px', height: '56px', flexShrink: 0,
                                borderRadius: '14px',
                                background: isModuleComplete
                                    ? 'rgba(16, 185, 129, 0.12)'
                                    : 'rgba(0, 229, 255, 0.08)',
                                border: `1px solid ${isModuleComplete ? 'rgba(16,185,129,0.35)' : 'rgba(0,229,255,0.2)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.8rem',
                            }}>
                                {module.icon ?? '📚'}
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                                        Module {mIndex + 1}
                                    </span>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                        {completedCount}/{totalLessons} lessons
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '4px' }}>
                                    {module.title}
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                                    {module.description}
                                </p>
                                {/* Module progress bar */}
                                <div style={{ marginTop: '10px', height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${moduleProgress}%` }}
                                        transition={{ duration: 0.9, ease: 'easeOut', delay: mIndex * 0.1 }}
                                        style={{
                                            height: '100%',
                                            background: isModuleComplete
                                                ? 'var(--color-success)'
                                                : 'linear-gradient(90deg, var(--color-primary), var(--color-tertiary))',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Lesson Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(262px, 1fr))',
                            gap: '14px',
                        }}>
                            {module.lessons.map((lesson, lIndex) => {
                                const isCompleted = completedLessons.includes(lesson.id);
                                const isUnlocked = unlockedLessons.includes(lesson.id) || isCompleted;
                                const isLocked = !isUnlocked;

                                return (
                                    <motion.div
                                        key={lesson.id}
                                        whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
                                        whileTap={!isLocked ? { scale: 0.97 } : {}}
                                        onClick={() => !isLocked && onStartLesson(lesson.id)}
                                        className="glass-panel"
                                        style={{
                                            padding: '18px',
                                            cursor: isLocked ? 'not-allowed' : 'pointer',
                                            opacity: isLocked ? 0.52 : 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderColor: isCompleted
                                                ? 'var(--color-success)'
                                                : isUnlocked ? 'var(--color-primary)'
                                                    : 'var(--color-border)',
                                            boxShadow: isUnlocked && !isCompleted ? '0 0 20px var(--color-primary-glow)' : 'none',
                                        }}
                                    >
                                        {/* Active glow bg */}
                                        {isUnlocked && !isCompleted && (
                                            <div style={{
                                                position: 'absolute', top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
                                                background: 'radial-gradient(circle at center, rgba(6,182,212,0.09) 0%, transparent 60%)',
                                                zIndex: 0, pointerEvents: 'none'
                                            }} />
                                        )}

                                        {/* Top row: status icon + lesson label */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                                            <div style={{
                                                width: '36px', height: '36px',
                                                borderRadius: '9px',
                                                backgroundColor: isCompleted
                                                    ? 'rgba(16,185,129,0.15)'
                                                    : isUnlocked ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                color: isCompleted ? 'var(--color-success)' : isUnlocked ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                            }}>
                                                {isCompleted ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={17} /> : <Play size={17} fill="currentColor" />}
                                            </div>
                                            <span style={{
                                                fontSize: '0.72rem', fontWeight: 700,
                                                color: 'var(--color-text-muted)',
                                                textTransform: 'uppercase', letterSpacing: '1px'
                                            }}>
                                                Lesson {lIndex + 1}
                                            </span>
                                        </div>

                                        {/* Title & description */}
                                        <div style={{ zIndex: 1 }}>
                                            <h4 style={{
                                                fontSize: '1.05rem', fontWeight: 700,
                                                color: isLocked ? 'var(--color-text-muted)' : 'var(--color-text)',
                                                marginBottom: '4px', lineHeight: 1.3,
                                            }}>
                                                {lesson.title}
                                            </h4>
                                            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                                                {lesson.description}
                                            </p>
                                        </div>

                                        {/* XP badge + question count */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1, marginTop: '2px' }}>
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                padding: '3px 9px', borderRadius: '8px',
                                                background: isCompleted ? 'rgba(16,185,129,0.1)' : 'rgba(0,229,255,0.07)',
                                                border: `1px solid ${isCompleted ? 'rgba(16,185,129,0.25)' : 'rgba(0,229,255,0.18)'}`,
                                            }}>
                                                <Zap size={11} color={isCompleted ? 'var(--color-success)' : 'var(--color-primary)'} />
                                                <span style={{
                                                    fontSize: '0.72rem', fontWeight: 700,
                                                    color: isCompleted ? 'var(--color-success)' : 'var(--color-primary)'
                                                }}>
                                                    {lesson.xp ?? 100} XP
                                                </span>
                                            </div>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                                {lesson.questions.length} questions
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
