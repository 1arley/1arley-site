"use client";

import React from 'react';

interface SectionDividerProps {
    className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ className = "" }) => {
    return (
        <div
            className={`h-80 w-full relative z-20 pointer-events-none -my-40 ${className}`}
            style={{
                background: 'linear-gradient(to bottom, transparent, hsl(var(--background) / 0.1) 10%, hsl(var(--background) / 0.6) 30%, hsl(var(--background)) 50%, hsl(var(--background) / 0.6) 70%, hsl(var(--background) / 0.1) 90%, transparent)',
            }}
        />
    );
};

export default SectionDivider;
