'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light');

    const applyTheme = (t: Theme) => {
        if (typeof window === 'undefined') return;
        const root = window.document.documentElement;
        if (t === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    };

    useEffect(() => {
        // 1. Immediate load from localStorage for better UX
        const savedTheme = localStorage.getItem('agro-theme') as Theme;
        if (savedTheme) {
            setThemeState(savedTheme);
            applyTheme(savedTheme);
        }

        // 2. Fetch from DB for cross-device persistence
        const fetchTheme = async () => {
            try {
                const res = await fetch('/api/user/preferences');
                if (res.ok) {
                    const data = await res.json();
                    if (data.themePreference && data.themePreference !== savedTheme) {
                        setThemeState(data.themePreference);
                        applyTheme(data.themePreference);
                        localStorage.setItem('agro-theme', data.themePreference);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch theme preference', err);
            }
        };
        fetchTheme();
    }, []);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        applyTheme(t);
        localStorage.setItem('agro-theme', t);
        // Persist to DB
        fetch('/api/user/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ themePreference: t }),
        });
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
