"use client";

import React, { useState, useEffect } from "react";

export function InteractiveEditorDemo() {
  const [typedText, setTypedText] = useState("with zero handoff delay.");

  const activeUsers = [
    { name: "AKKI", role: "OWNER", status: "ONLINE", color: "#F97316" },
    { name: "SARAH", role: "EDITOR", status: "TYPING...", color: "#EC4899" },
    { name: "MARK", role: "REVIEWER", status: "ONLINE", color: "#10B981" },
  ];

  // Subtle simulated typing effect for Sarah's co-author cursor
  useEffect(() => {
    const textVariants = [
      "with zero handoff delay.",
      "across global edge nodes.",
      "with 100% state convergence.",
      "without server lockouts.",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % textVariants.length;
      setTypedText(textVariants[idx]);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#1E1E1E] border border-[#333333] shadow-2xl overflow-hidden font-sans select-none">
      {/* Editor Top Bar */}
      <div className="bg-[#121212] text-[#F5F5F5] px-4 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-[#F97316]" />
          <span className="font-mono-tech text-xs tracking-wide uppercase font-semibold">
            DOC_0042 // architecture_spec.md
          </span>
          <span className="bg-[#F97316] text-white font-mono-tech text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold">
            SYNCED
          </span>
        </div>

        {/* Active Collaborators Indicator */}
        <div className="flex items-center gap-2 font-mono-tech text-[10px]">
          <span className="text-[#A3A3A3] uppercase tracking-widest hidden sm:inline">
            3 ACTIVE USERS:
          </span>
          {activeUsers.map((u) => (
            <div
              key={u.name}
              className="flex items-center gap-1.5 bg-[#262626] border border-[#333333] px-2 py-0.5 text-white"
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: u.color }}
              />
              <span className="font-semibold">{u.name}</span>
              <span className="text-[#A3A3A3] hidden md:inline">{u.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Sub-Header (Preview Showcase Banner) */}
      <div className="bg-[#181818] border-b border-[#262626] px-4 py-2 flex items-center justify-between font-mono-tech text-xs text-[#A3A3A3]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
          <span className="uppercase text-[9px] sm:text-[10px] tracking-widest font-semibold text-[#F5F5F5]">
            PREVIEW SHOWCASE // REAL-TIME CO-AUTHORING
          </span>
        </div>

        <div className="flex items-center gap-3 text-[9px] sm:text-[10px] uppercase tracking-wider">
          <span>WORDS: <strong className="text-[#F5F5F5]">43</strong></span>
          <span>CHARS: <strong className="text-[#F5F5F5]">319</strong></span>
        </div>
      </div>

      {/* Main Rendered Document Canvas in Google Sans (Proportional font size) */}
      <div className="relative p-5 sm:p-6 md:p-8 min-h-[280px] bg-[#1E1E1E] font-sans pointer-events-none select-none space-y-4">

        {/* Document Heading */}
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-[#F5F5F5] tracking-tight">
          # CollabNote Architecture Specification
        </h2>

        {/* Document Body Paragraph 1 */}
        <p className="text-xs sm:text-sm leading-relaxed text-[#D4D4D4] max-w-3xl">
          CollabNote is engineered around Conflict-free Replicated Data Types (CRDT). Every keystroke is broadcast across all connected peers with deterministic state convergence{" "}
          <span className="bg-[#F97316]/30 text-white px-1 py-0.5 rounded-none border-b-2 border-[#F97316]">
            {typedText}
          </span>
        </p>

        {/* Co-author Sarah's Pink "I" Beam Cursor */}
        <div className="inline-flex items-center gap-1 my-0.5">
          <div className="flex flex-col items-center justify-between h-4 w-1.5 text-[#EC4899]">
            <div className="w-2 h-[2px] bg-[#EC4899]" />
            <div className="w-[1.5px] h-full bg-[#EC4899] animate-pulse" />
            <div className="w-2 h-[2px] bg-[#EC4899]" />
          </div>
          <span className="bg-[#EC4899] text-white font-mono-tech text-[8px] sm:text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold shadow-md">
            SARAH (TYPING...)
          </span>
        </div>

        {/* Document Bullet List */}
        <ul className="space-y-1.5 text-xs text-[#A3A3A3] font-mono-tech pt-1">
          <li className="flex items-center gap-2">
            <span className="text-[#F97316] font-bold">-</span> Latency Target: &lt; 4ms
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#F97316] font-bold">-</span> Peer Connections: WebSockets + WebRTC mesh fallback
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#F97316] font-bold">-</span> Vector Clock Revision: 0184
          </li>
        </ul>

        {/* Selected text highlight visual tag */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-[#121212] text-[#F5F5F5] font-mono-tech text-[9px] sm:text-[10px] px-2.5 py-1 flex items-center gap-2.5 border border-[#333333]">
          <span className="text-[#F97316]">● AKKI SELECTED 42 CHARS</span>
          <span className="text-[#A3A3A3]">REV #0184</span>
        </div>
      </div>
    </div>
  );
}
