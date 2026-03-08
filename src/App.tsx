import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { LearningPath } from './components/LearningPath';
import { Lesson } from './components/Lesson';
import { BridgeMode } from './components/BridgeMode';
import { useAppStore } from './store';
import { Medal, Trophy, Star, MessageCircle, CheckCircle2 } from 'lucide-react';
import './App.css';

function App() {
  const { streak, xp, dialect, setDialect, updateStreak, achievements, lessonsCompletedToday } = useAppStore();
  const [currentTab, setCurrentTab] = useState('learn');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [showBridgeMode, setShowBridgeMode] = useState(false);

  // Persistence State
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [unlockedLessons, setUnlockedLessons] = useState<string[]>(['lesson-a-c']); // Unlock first strictly

  // Load from localStorage on mount
  useEffect(() => {
    updateStreak();
    const savedCompleted = localStorage.getItem('asl-course-completed');
    const savedUnlocked = localStorage.getItem('asl-course-unlocked');

    if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));
    if (savedUnlocked) setUnlockedLessons(JSON.parse(savedUnlocked));
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('asl-course-completed', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('asl-course-unlocked', JSON.stringify(unlockedLessons));
  }, [unlockedLessons]);

  const handleLessonComplete = (lessonId: string) => {
    setActiveLessonId(null);
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);

      // Unlock next logic (simplified: if 'lesson-a-c' complete, unlock 'lesson-d-f', etc via LESSON_ORDER in real app, we'll hardcode unlock for demo)
      import('./data/course').then(({ LESSON_ORDER }) => {
        const currentIndex = LESSON_ORDER.indexOf(lessonId);
        if (currentIndex !== -1 && currentIndex + 1 < LESSON_ORDER.length) {
          const nextLesson = LESSON_ORDER[currentIndex + 1];
          if (!unlockedLessons.includes(nextLesson)) {
            setUnlockedLessons(prev => [...prev, nextLesson]);
          }
        }
      });
    }
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {activeLessonId !== null ? (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, backgroundColor: 'var(--color-bg)' }}
          >
            <Lesson
              lessonId={activeLessonId}
              onClose={() => setActiveLessonId(null)}
              onComplete={handleLessonComplete}
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}
          >
            <TopBar />

            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', position: 'relative' }}
            >
              {currentTab === 'learn' && (
                <>
                  <LearningPath
                    completedLessons={completedLessons}
                    unlockedLessons={unlockedLessons}
                    onStartLesson={(id) => setActiveLessonId(id)}
                  />

                  {/* Floating Action Button for The Bridge Mode */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBridgeMode(true)}
                    style={{
                      position: 'fixed',
                      bottom: '90px',
                      right: '20px',
                      width: '60px',
                      height: '60px',
                      borderRadius: '30px',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-tertiary))',
                      border: 'none',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
                      cursor: 'pointer',
                      zIndex: 50
                    }}
                  >
                    <MessageCircle size={28} />
                  </motion.button>
                </>
              )}

              {currentTab === 'leaderboard' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px' }}>
                  <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <Trophy size={48} color="var(--color-primary)" style={{ margin: '0 auto 16px' }} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)' }}>Global Rank</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Your total XP: {xp}</p>
                  </div>
                  <div className="glass-panel" style={{ padding: '16px' }}>
                    {[
                      { name: 'AlexTheGreat', xp: 5400 },
                      { name: 'SignMaster99', xp: 4200 },
                      { name: 'You', xp: xp, isUser: true },
                      { name: 'DeafCultureFan', xp: 2100 },
                      { name: 'HandTalker', xp: 800 }
                    ].sort((a, b) => b.xp - a.xp).map((user, i) => (
                      <div key={user.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: user.isUser ? 'bold' : 'normal', color: user.isUser ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>#{i + 1}</span>
                          <span>{user.name}</span>
                        </div>
                        <span>{user.xp} XP</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTab === 'quests' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', textAlign: 'center' }}>
                  <div className="glass-panel" style={{ padding: '32px', width: '100%', maxWidth: '500px', margin: 'auto' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '24px' }}>Daily Quests</h2>

                    {/* Streak Quest */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', borderLeft: streak > 0 ? '4px solid var(--color-success)' : '4px solid var(--color-primary)' }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontWeight: 'bold' }}>Maintain your streak</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{streak > 0 ? 'Completed!' : 'Practice today to keep it up.'}</p>
                      </div>
                      {streak > 0 ? <CheckCircle2 color="var(--color-success)" size={28} /> : null}
                    </div>

                    {/* Lesson Quest */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', borderLeft: lessonsCompletedToday >= 2 ? '4px solid var(--color-success)' : '4px solid var(--color-tertiary)' }}>
                      <div style={{ textAlign: 'left' }}>
                        <p style={{ fontWeight: 'bold' }}>Active Learner</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Complete 2 lessons today.</p>
                      </div>
                      <div style={{ fontWeight: 600, color: lessonsCompletedToday >= 2 ? 'var(--color-success)' : 'var(--color-text)' }}>
                        {Math.min(lessonsCompletedToday, 2)} / 2
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'profile' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
                  <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>Operative Profile</h2>
                    <p style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{completedLessons.length} Modules Completed | {streak} Day Streak</p>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Settings</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <label style={{ fontWeight: 600 }}>Regional Dialect</label>
                      <select
                        value={dialect}
                        onChange={(e) => setDialect(e.target.value as 'ASL' | 'BSL' | 'ISL')}
                        style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <option value="ASL" style={{ background: '#1a1a1a' }}>American (ASL)</option>
                        <option value="BSL" style={{ background: '#1a1a1a' }}>British (BSL)</option>
                        <option value="ISL" style={{ background: '#1a1a1a' }}>Indian (ISL)</option>
                      </select>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Achievements</h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {achievements.length === 0 ? (
                        <p style={{ color: 'var(--color-text-muted)' }}>No achievements yet. Keep learning!</p>
                      ) : (
                        achievements.map(ach => (
                          <div key={ach} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--color-bg-elevated)', borderRadius: '20px', border: '1px solid var(--color-primary)' }}>
                            <Medal size={16} color="var(--color-primary)" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{ach.replace('-', ' ').toUpperCase()}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: '24px', textAlign: 'center' }}>
                    <button className="btn-glass btn-rose" onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}>RESET PROGRESS</button>
                  </div>
                </div>
              )}
            </motion.div>

            <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

            <AnimatePresence>
              {showBridgeMode && (
                <motion.div
                  initial={{ opacity: 0, y: '100%' }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  style={{ position: 'fixed', inset: 0, zIndex: 150 }}
                >
                  <BridgeMode onClose={() => setShowBridgeMode(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
