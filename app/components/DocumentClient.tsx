"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TechnicalAnnotation } from "./TechnicalAnnotation";

interface DocumentClientProps {
    id: string;
}

const MOCKUP_DOCS: Record<string, { title: string; content: string }> = {
    doc_001: {
        title: "CollabNote Architecture Spec",
        content: `# CollabNote Architecture Spec\n\nCollabNote is engineered around Conflict-free Replicated Data Types (CRDT). Every keystroke is broadcast with deterministic state convergence.\n\n- Latency Target: < 4ms\n- Peer Connections: WebSockets + WebRTC mesh fallback\n- Vector Clock Revision: 0184`,
    },
    doc_002: {
        title: "CRDT State Vector Notes",
        content: `# CRDT State Vector Notes\n\nVector clock revisions resolve concurrent edits without server lockouts or handoff friction.\n\n- CRDT Revisions synchronized: 0092\n- Sync interval: realtime`,
    },
    doc_003: {
        title: "System Design & Benchmarks",
        content: `# System Design & Benchmarks\n\nLatency target < 4ms. Peer connections with WebSockets & WebRTC mesh fallback.\n\n- Benchmark testing results: completed\n- Connection limits: infinite scale`,
    },
    doc_004: {
        title: "Untitled document",
        content: `# Untitled document\n\nQuick scratchpad notes for sprint retrospective and API contract definitions.\n\n- Created: today`,
    },
    doc_005: {
        title: "Product Roadmap Q3/Q4",
        content: `# Product Roadmap Q3/Q4\n\nMilestone 1: Dynamic co-author presence cursors. Milestone 2: Offline delta buffer storage in IndexedDB.\n\n- Q3 Goals: Complete CRDT verification\n- Q4 Goals: Secure peer authentication`,
    },
    doc_006: {
        title: "API Authentication Routes",
        content: `# API Authentication Routes\n\nJWT token validation, refresh cookies, CORS origin verification, bcrypt password hashing.\n\n- Backend server URL: http://localhost:8080\n- Expiry: 7 days`,
    },
};

export function DocumentClient({ id }: DocumentClientProps) {
    const router = useRouter();
    const [title, setTitle] = useState("Loading...");
    const [content, setContent] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [syncStatus, setSyncStatus] = useState<"SYNCED" | "SAVING..." | "SAVE_FAILED">("SYNCED");
    const [typedText, setTypedText] = useState("with zero handoff delay.");

    const isMockup = id.startsWith("doc_") || id.startsWith("tpl_");

    // Sarah cursor dynamic typing animation
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

    // Load initial document content
    useEffect(() => {
        const fetchDocument = async () => {
            if (isMockup) {
                const doc = MOCKUP_DOCS[id] || {
                    title: "Untitled document",
                    content: "# Untitled document\n\nStart typing...",
                };
                setTitle(doc.title);
                setContent(doc.content);
                setIsLoaded(true);
                return;
            }

            const authServerUrl =
                process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";
            try {
                const res = await fetch(`${authServerUrl}/document/fetch?id=${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.document) {
                        setTitle(data.document.title || "Untitled document");
                        setContent(data.document.content || "");
                    }
                } else {
                    console.error("Document not found in database, creating placeholder");
                    setTitle("Untitled document");
                    setContent("");
                }
            } catch (err) {
                console.error("Error loading document:", err);
                setTitle("Untitled document");
                setContent("");
            } finally {
                setIsLoaded(true);
            }
        };

        fetchDocument();
    }, [id, isMockup]);

    // Autosave document content with debouncing
    useEffect(() => {
        if (!isLoaded) return;

        if (isMockup) {
            setSyncStatus("SAVING...");
            const timer = setTimeout(() => {
                setSyncStatus("SYNCED");
            }, 600);
            return () => clearTimeout(timer);
        }

        setSyncStatus("SAVING...");
        const delayDebounce = setTimeout(async () => {
            const authServerUrl =
                process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";
            try {
                const res = await fetch(`${authServerUrl}/document/update`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id, title, content }),
                });
                if (res.ok) {
                    setSyncStatus("SYNCED");
                } else {
                    setSyncStatus("SAVE_FAILED");
                }
            } catch (err) {
                console.error("Autosave error:", err);
                setSyncStatus("SAVE_FAILED");
            }
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [content, title, id, isLoaded, isMockup]);

    // Calculate word and character count
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const charCount = content.length;

    const activeUsers = [
        { name: "AKKI", role: "OWNER", status: "ONLINE", color: "#F97316" },
        {
            name: "SARAH",
            role: "EDITOR",
            status: "TYPING...",
            color: "#EC4899",
        },
        { name: "MARK", role: "REVIEWER", status: "ONLINE", color: "#10B981" },
    ];

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex items-center justify-center font-sans">
                <div className="space-y-4 text-center">
                    <div className="w-10 h-10 border-4 border-t-[#F97316] border-[#333333] rounded-full animate-spin mx-auto" />
                    <div className="font-mono-tech text-xs tracking-widest text-[#A3A3A3] uppercase">
                        // INITIALIZING STATE VECTOR...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#F97316] selection:text-white">
            {/* Top Navigation / Toolbar */}
            <header className="sticky top-0 z-50 bg-[#121212] border-b border-[#262626] px-4 md:px-6 h-16 flex items-center justify-between gap-4">
                {/* Left side: Back button and editable document title */}
                <div className="flex items-center gap-4 min-w-0">
                    <Link
                        href="/workspace"
                        className="font-mono-tech text-xs uppercase px-3 py-1.5 bg-[#262626] text-[#A3A3A3] hover:text-white hover:bg-[#333333] border border-[#333333] transition-colors shrink-0"
                    >
                        ← WORKSPACE
                    </Link>

                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 bg-[#F97316] shrink-0" />
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-[#333333] focus:border-[#F97316] text-[#F5F5F5] font-mono-tech text-sm tracking-wide font-semibold focus:outline-none px-1 py-0.5 truncate w-40 sm:w-60 md:w-80"
                            placeholder="Untitled document"
                        />
                    </div>

                    <span
                        className={`font-mono-tech text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold shrink-0 ${
                            syncStatus === "SYNCED"
                                ? "bg-[#F97316]/20 text-[#F97316]"
                                : syncStatus === "SAVING..."
                                ? "bg-blue-900/30 text-blue-400"
                                : "bg-red-900/30 text-red-400"
                        }`}
                    >
                        {syncStatus}
                    </span>
                </div>

                {/* Right side: Session presence */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 font-mono-tech text-[10px]">
                        <span className="text-[#A3A3A3] uppercase tracking-widest hidden lg:inline">
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
                                <span className="text-[#A3A3A3] hidden md:inline">
                                    {u.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Sub-Header bar for metadata & stats */}
            <div className="bg-[#181818] border-b border-[#262626] px-4 md:px-6 py-2 flex items-center justify-between font-mono-tech text-xs text-[#A3A3A3]">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                    <span className="uppercase text-[9px] sm:text-[10px] tracking-widest font-semibold text-[#F5F5F5]">
                        REAL-TIME CO-AUTHOR SPEC // ID: {id.slice(0, 8)}
                    </span>
                </div>

                <div className="flex items-center gap-3 text-[9px] sm:text-[10px] uppercase tracking-wider">
                    <span>
                        WORDS: <strong className="text-[#F5F5F5]">{wordCount}</strong>
                    </span>
                    <span>
                        CHARS: <strong className="text-[#F5F5F5]">{charCount}</strong>
                    </span>
                </div>
            </div>

            {/* Document Editor Canvas */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8">
                <div className="w-full bg-[#1E1E1E] border border-[#333333] shadow-2xl p-6 relative flex flex-col min-h-[500px]">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full flex-1 bg-transparent text-[#D4D4D4] font-sans text-sm md:text-base leading-relaxed focus:outline-none resize-none min-h-[440px]"
                        placeholder="Write your document..."
                    />

                    {/* Simulated typing visual decoration at the bottom */}
                    <div className="mt-4 pt-4 border-t border-[#262626] flex flex-wrap items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-1.5 font-mono-tech">
                            <div className="flex flex-col items-center justify-between h-4 w-1.5 text-[#EC4899]">
                                <div className="w-2 h-[2px] bg-[#EC4899]" />
                                <div className="w-[1.5px] h-full bg-[#EC4899] animate-pulse" />
                                <div className="w-2 h-[2px] bg-[#EC4899]" />
                            </div>
                            <span className="bg-[#EC4899] text-white text-[8px] sm:text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold">
                                SARAH is typing: "{typedText}"
                            </span>
                        </div>

                        <div className="bg-[#121212] text-[#F5F5F5] font-mono-tech text-[9px] sm:text-[10px] px-2 py-0.5 flex items-center gap-2 border border-[#333333]">
                            <span className="text-[#F97316]">
                                ● AKKI ACTIVE
                            </span>
                            <span className="text-[#737373]">REV #0184</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
