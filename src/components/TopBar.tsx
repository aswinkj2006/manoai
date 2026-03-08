import React from 'react';
import { Heart, Diamond, Flame, Globe } from 'lucide-react';
import { useAppStore } from '../store';

export const TopBar: React.FC = () => {
    const { streak, xp, dialect } = useAppStore();
    return (
        <div className="glass-panel" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            margin: '0',
            borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-light)', fontWeight: 700 }}>
                <img src="/vite.svg" alt="Logo" style={{ width: '24px', height: '24px' }} />
            </div>

            <div style={{ display: 'flex', gap: '16px', fontWeight: 800 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)' }} title="Sign Language Dialect">
                    <Globe size={20} />
                    <span>{dialect}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff9600' }} title="Daily Streak">
                    <Flame size={20} fill="currentColor" />
                    <span>{streak}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-tertiary)' }} title="XP / Score">
                    <Diamond size={20} fill="currentColor" />
                    <span>{xp}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-secondary)' }} title="Lives">
                    <Heart size={20} fill="currentColor" />
                    <span>5</span>
                </div>
            </div>
        </div>
    );
};
