"use client";

import React, { useState, useEffect } from "react";

interface CollaboratorCursor {
    id: string;
    name: string;
    label: string;
    color: string;
    glowColor: string;
    xPct: number;
    yPct: number;
}

const INITIAL_CURSORS: CollaboratorCursor[] = [
    {
        id: "c1",
        name: "AKKI",
        label: "ACTIVE",
        color: "#F97316",
        glowColor: "rgba(249, 115, 22, 0.45)",
        xPct: 62,
        yPct: 24,
    },
    {
        id: "c2",
        name: "SARAH",
        label: "TYPING L14",
        color: "#EC4899",
        glowColor: "rgba(236, 72, 153, 0.45)",
        xPct: 28,
        yPct: 65,
    },
    {
        id: "c3",
        name: "DEVIN",
        label: "IN SYNC",
        color: "#10B981",
        glowColor: "rgba(16, 185, 129, 0.45)",
        xPct: 76,
        yPct: 42,
    },
    {
        id: "c4",
        name: "ELENA",
        label: "REVISING",
        color: "#F59E0B",
        glowColor: "rgba(245, 158, 11, 0.45)",
        xPct: 45,
        yPct: 82,
    },
];

export function PixelSteppedHero() {
    const [cursors, setCursors] =
        useState<CollaboratorCursor[]>(INITIAL_CURSORS);

    // Autonomous Smooth Wandering for the 4 co-author cursors
    useEffect(() => {
        const interval = setInterval(() => {
            setCursors((prev) =>
                prev.map((c) => {
                    const deltaX = (Math.random() - 0.5) * 35;
                    const deltaY = (Math.random() - 0.5) * 30;

                    const newXPct = Math.min(Math.max(c.xPct + deltaX, 8), 90);
                    const newYPct = Math.min(Math.max(c.yPct + deltaY, 12), 85);

                    return {
                        ...c,
                        xPct: newXPct,
                        yPct: newYPct,
                    };
                }),
            );
        }, 2200);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] lg:h-[540px] overflow-hidden select-none bg-[#E8E8E8]">
            {/* Stepped Pixel SVG Composition in Dominant Black on Light Canvas */}
            <svg
                className="absolute inset-0 w-full h-full text-[#121212]"
                viewBox="0 0 1000 500"
                preserveAspectRatio="none"
                fill="currentColor"
            >
                {/* Main large asymmetric stepped black silhouette */}
                <path
                    d="
          M 480 0 
          H 1000 
          V 500 
          H 360 
          V 440 
          H 420 
          V 380 
          H 460 
          V 340 
          H 520 
          V 280 
          H 580 
          V 240 
          H 620 
          V 180 
          H 540 
          V 220 
          H 440 
          V 260 
          H 380 
          V 300 
          H 320 
          V 340 
          H 240 
          V 380 
          H 160 
          V 420 
          H 80 
          V 460 
          H 0 
          V 500 
          H 1000 
          V 0 
          Z
        "
                />

                {/* Floating/stepped pixel accents */}
                <rect x="420" y="40" width="30" height="30" />
                <rect x="450" y="70" width="30" height="30" />
                <rect x="390" y="100" width="30" height="30" />
                <rect x="740" y="80" width="40" height="40" fill="#E8E8E8" />
                <rect x="880" y="160" width="30" height="30" />
                <rect x="910" y="210" width="40" height="40" fill="#E8E8E8" />
                <rect x="310" y="220" width="30" height="30" fill="#E8E8E8" />
            </svg>

            {/* Top Banner Online User Counter Indicator with Solid Green Square Dot */}
            <div className="absolute top-4 left-4 sm:left-6 z-30 pointer-events-none">
                <div className="bg-[#121212] text-white px-3 py-1 font-mono-tech text-[10px] uppercase tracking-wider border border-[#121212] flex items-center gap-2 shadow-md">
                    <span className="w-2 h-2 bg-[#10B981]" />
                    <span>USERS ONLINE: [4]</span>
                </div>
            </div>

            {/* Dynamic Multi-Color Co-Author Cursors wandering across full canvas */}
            {cursors.map((cursor) => (
                <div
                    key={cursor.id}
                    className="absolute z-20 pointer-events-none transition-all duration-1000 ease-in-out"
                    style={{
                        left: `${cursor.xPct}%`,
                        top: `${cursor.yPct}%`,
                    }}
                >
                    {/* Glowing aura backdrop */}
                    <div
                        className="absolute -inset-4 blur-md rounded-full opacity-60"
                        style={{ backgroundColor: cursor.glowColor }}
                    />

                    <div className="relative flex items-center gap-1.5">
                        {/* Cursor SVG Arrow Pointer */}
                        <svg
                            className="w-5 h-5 drop-shadow-md transition-transform duration-300"
                            style={{ color: cursor.color }}
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M3 3l7 18 3-7 7-3L3 3z" />
                        </svg>

                        {/* Co-author Label Tag */}
                        <span
                            className="text-white font-mono-tech text-[9px] px-2 py-0.5 tracking-wider uppercase shadow-md font-bold whitespace-nowrap"
                            style={{ backgroundColor: cursor.color }}
                        >
                            {cursor.name} — {cursor.label}
                        </span>
                    </div>
                </div>
            ))}

            {/* Hero Overlay Editorial Copy */}
            <div className="absolute bottom-6 right-8 max-w-xs text-right hidden lg:block z-10 pointer-events-none">
                <p className="font-mono-tech text-[11px] text-[#858585] leading-relaxed">
                    // CRDT STATE VECTOR: 0x4F92 <br />
                    // LATENCY: 2.4MS <br />
                    Helping writers, engineers, and teams sync text with zero
                    handoffs and maximum speed.
                </p>
            </div>
        </div>
    );
}
