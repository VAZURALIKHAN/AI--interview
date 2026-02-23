import React, { useEffect, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ThemeSwitcher.css';

const themes = [
    { id: 'default', name: 'Galactic Indigo', colors: ['#6366f1', '#8b5cf6', '#0f172a'] },
    { id: 'emerald', name: 'Forest Emerald', colors: ['#10b981', '#0d9488', '#022c22'] },
    { id: 'sunset', name: 'Cyber Amber', colors: ['#f59e0b', '#f97316', '#1c1917'] },
    { id: 'royal', name: 'Royal Blue', colors: ['#3b82f6', '#6366f1', '#0a192f'] },
    { id: 'rose', name: 'Rose Quartz', colors: ['#f43f5e', '#d946ef', '#1e1b4b'] },
];

export default function ThemeSwitcher() {
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme') || 'default');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (currentTheme === 'default') {
            document.body.removeAttribute('data-theme');
        } else {
            document.body.setAttribute('data-theme', currentTheme);
        }
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    return (
        <div className="theme-switcher-container">
            <button
                className={`theme-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Change Theme"
            >
                <Palette size={20} />
                <span>Theme</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="theme-menu glass-card"
                    >
                        <div className="theme-menu-header">
                            <h4>Choose Theme</h4>
                        </div>
                        <div className="theme-options">
                            {themes.map((theme) => (
                                <button
                                    key={theme.id}
                                    className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setCurrentTheme(theme.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="theme-preview">
                                        {theme.colors.map((color, i) => (
                                            <div
                                                key={i}
                                                className="color-dot"
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                    <span className="theme-name">{theme.name}</span>
                                    {currentTheme === theme.id && <Check size={14} className="check-icon" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

