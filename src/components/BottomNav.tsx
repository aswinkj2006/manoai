import React from 'react';
import { Home, Trophy, User, Target } from 'lucide-react';

interface BottomNavProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    const tabs = [
        { id: 'learn', icon: <Home size={28} />, label: 'Learn' },
        { id: 'leaderboard', icon: <Trophy size={28} />, label: 'Leaderboard' },
        { id: 'quests', icon: <Target size={28} />, label: 'Quests' },
        { id: 'profile', icon: <User size={28} />, label: 'Profile' },
    ];

    return (
        <div className="glass-panel" style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '12px 0 24px 0',
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '600px',
            zIndex: 10,
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            borderBottom: 'none',
            borderLeft: 'none',
            borderRight: 'none',
        }}>
            {tabs.map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isActive ? 'var(--color-tertiary)' : 'var(--color-text-light)',
                            transition: 'color 0.2s',
                            padding: '8px',
                        }}
                    >
                        <div style={{
                            padding: '8px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: isActive ? 'rgba(28, 176, 246, 0.1)' : 'transparent',
                            marginBottom: '4px',
                        }}>
                            {React.cloneElement(tab.icon as any, {
                                fill: isActive ? 'currentColor' : 'none',
                                strokeWidth: isActive ? 2 : 2.5
                            })}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
