"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TechnicalAnnotation } from "./TechnicalAnnotation";

interface DocumentItem {
    id: string;
    title: string;
    openedDate: string;
    snippet: string;
    crdtRev: string;
    isTemplate?: boolean;
}

const TEMPLATES: DocumentItem[] = [
    {
        id: "tpl_blank",
        title: "Blank document",
        openedDate: "New Workspace",
        snippet: "Start writing from scratch with real-time CRDT sync...",
        crdtRev: "REV #0001",
        isTemplate: true,
    },
    {
        id: "tpl_arch",
        title: "Architecture Spec",
        openedDate: "Template",
        snippet: "CollabNote system architecture, CRDT vector clocks...",
        crdtRev: "REV #0012",
        isTemplate: true,
    },
    {
        id: "tpl_proposal",
        title: "Project Proposal",
        openedDate: "Template",
        snippet: "Executive summary, system requirements, tech stack...",
        crdtRev: "REV #0004",
        isTemplate: true,
    },
    {
        id: "tpl_report",
        title: "Technical Report",
        openedDate: "Template",
        snippet: "Latency benchmarks, memory profiles, edge telemetry...",
        crdtRev: "REV #0089",
        isTemplate: true,
    },
];

const RECENT_DOCUMENTS: DocumentItem[] = [
    {
        id: "doc_001",
        title: "CollabNote Architecture Spec",
        openedDate: "Opened Aug 1, 2026",
        snippet:
            "CollabNote is engineered around Conflict-free Replicated Data Types (CRDT). Every keystroke is broadcast with deterministic state convergence.",
        crdtRev: "REV #0184",
    },
    {
        id: "doc_002",
        title: "CRDT State Vector Notes",
        openedDate: "Opened Jul 21, 2026",
        snippet:
            "Vector clock revisions resolve concurrent edits without server lockouts or handoff friction.",
        crdtRev: "REV #0092",
    },
    {
        id: "doc_003",
        title: "System Design & Benchmarks",
        openedDate: "Opened Jul 17, 2026",
        snippet:
            "Latency target < 4ms. Peer connections with WebSockets & WebRTC mesh fallback.",
        crdtRev: "REV #0140",
    },
    {
        id: "doc_004",
        title: "Untitled document",
        openedDate: "Opened Jul 17, 2026",
        snippet:
            "Quick scratchpad notes for sprint retrospective and API contract definitions.",
        crdtRev: "REV #0015",
    },
    {
        id: "doc_005",
        title: "Product Roadmap Q3/Q4",
        openedDate: "Opened Jul 12, 2026",
        snippet:
            "Milestone 1: Dynamic co-author presence cursors. Milestone 2: Offline delta buffer storage in IndexedDB.",
        crdtRev: "REV #0210",
    },
    {
        id: "doc_006",
        title: "API Authentication Routes",
        openedDate: "Opened Jul 05, 2026",
        snippet:
            "JWT token validation, refresh cookies, CORS origin verification, bcrypt password hashing.",
        crdtRev: "REV #0054",
    },
];

export function WorkspaceClient() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);
    const [docContent, setDocContent] = useState("");
    const [filterOwner, setFilterOwner] = useState("Owned by anyone");

    const handleOpenDoc = (doc: DocumentItem) => {
        setActiveDoc(doc);
        setDocContent(
            `# ${doc.title}\n\n${doc.snippet}\n\n- Created in CollabNote Workspace\n- Real-time State Vector Sync Enabled\n- Latency Target: < 4ms\n\nStart typing your document here...`,
        );
    };

    const handleLogout = () => {
        router.push("/login");
    };

    const filteredDocs = RECENT_DOCUMENTS.filter(
        (d) =>
            d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.snippet.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#F97316] selection:text-white">
            {/* Top Google Docs Style Navigation Bar */}
            <header className="sticky top-0 z-50 bg-[#121212] border-b border-[#262626] px-4 md:px-6 h-16 flex items-center justify-between gap-4">
                {/* Left: Brand Logo & Workspace Title */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-7 h-7 bg-[#F5F5F5] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                            <div className="w-2.5 h-2.5 bg-[#F97316]" />
                        </div>
                        <span className="font-bold text-base tracking-tight text-[#F5F5F5] uppercase">
                            CollabNote{" "}
                            <span className="text-[#A3A3A3] text-xs font-normal">
                                Docs
                            </span>
                        </span>
                    </Link>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-2xl mx-2 md:mx-6">
                    <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-[#A3A3A3] text-sm pointer-events-none">
                            🔍
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1E1E1E] border border-[#333333] font-mono-tech text-xs text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:border-[#F97316] transition-colors shadow-inner"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 text-xs text-[#A3A3A3] hover:text-white"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: User Profile & Controls */}
                <div className="flex items-center gap-3 shrink-0">
                    <TechnicalAnnotation
                        label="WORKSPACE"
                        value="ACTIVE"
                        variant="accent"
                        className="hidden sm:inline-flex"
                    />

                    <div className="flex items-center gap-2 bg-[#1E1E1E] border border-[#333333] px-3 py-1.5 font-mono-tech text-xs">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                        <span className="font-semibold text-white truncate max-w-[120px]">
                            Active Session
                        </span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="font-mono-tech text-xs uppercase px-3 py-1.5 bg-[#262626] text-[#A3A3A3] hover:text-white hover:bg-[#333333] border border-[#333333] transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </header>

            {/* Main Workspace Workspace Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-10">
                {/* Active Document Overlay Modal / Viewport */}
                {activeDoc && (
                    <div className="mb-10 bg-[#1E1E1E] border border-[#F97316] shadow-2xl p-6 relative">
                        <div className="flex items-center justify-between border-b border-[#333333] pb-4 mb-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-[#F97316] text-white font-mono-tech text-[10px] px-2 py-0.5 uppercase font-bold">
                                    LIVE DOC
                                </span>
                                <h2 className="text-lg font-bold text-white font-mono-tech">
                                    {activeDoc.title}
                                </h2>
                            </div>
                            <button
                                onClick={() => setActiveDoc(null)}
                                className="font-mono-tech text-xs text-[#A3A3A3] hover:text-white px-3 py-1 bg-[#262626] border border-[#333333]"
                            >
                                CLOSE EDITOR [✕]
                            </button>
                        </div>

                        <textarea
                            value={docContent}
                            onChange={(e) => setDocContent(e.target.value)}
                            className="w-full h-64 bg-[#121212] border border-[#333333] p-4 font-sans text-base text-[#F5F5F5] focus:outline-none focus:border-[#F97316] leading-relaxed resize-none"
                            placeholder="Write your document..."
                        />
                    </div>
                )}

                {/* Section 1: Start a new document (Template Gallery) */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-mono-tech text-xs uppercase tracking-widest text-[#F5F5F5] font-bold">
                            Start a new document
                        </h2>
                        <div className="flex items-center gap-2 font-mono-tech text-xs text-[#A3A3A3]">
                            <span className="hover:text-white cursor-pointer">
                                Template gallery ↕
                            </span>
                        </div>
                    </div>

                    {/* Template Gallery Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {/* Blank Document Card with Google Docs Style Multi-Color Plus Sign */}
                        <div
                            onClick={() =>
                                handleOpenDoc({
                                    id: `doc_${Date.now()}`,
                                    title: "Untitled document",
                                    openedDate: "Opened just now",
                                    snippet:
                                        "Start writing from scratch with real-time CRDT state synchronization.",
                                    crdtRev: "REV #0001",
                                })
                            }
                            className="group cursor-pointer flex flex-col space-y-2"
                        >
                            <div className="h-44 bg-[#1E1E1E] border border-[#333333] group-hover:border-[#F97316] transition-all flex items-center justify-center relative overflow-hidden shadow-md">
                                {/* Multi-colored Google Docs style '+' Plus Icon */}
                                <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                                    <div className="absolute w-10 h-2 bg-[#3B82F6]" />
                                    <div className="absolute w-2 h-10 bg-[#EF4444]" />
                                    <div className="absolute w-6 h-2 bg-[#F59E0B] left-0" />
                                    <div className="absolute w-2 h-6 bg-[#10B981] top-0" />
                                </div>
                            </div>
                            <span className="font-mono-tech text-xs font-semibold text-[#F5F5F5] group-hover:text-[#F97316] transition-colors">
                                Blank document
                            </span>
                        </div>

                        {/* Template Card Items */}
                        {TEMPLATES.slice(1).map((tpl) => (
                            <div
                                key={tpl.id}
                                onClick={() => handleOpenDoc(tpl)}
                                className="group cursor-pointer flex flex-col space-y-2"
                            >
                                <div className="h-44 bg-[#1E1E1E] border border-[#333333] group-hover:border-[#F97316] p-4 transition-all flex flex-col justify-between relative overflow-hidden shadow-md">
                                    <div className="space-y-1">
                                        <span className="text-[#F97316] font-mono-tech text-[9px] uppercase font-bold">
                                            {tpl.title}
                                        </span>
                                        <p className="font-mono-tech text-[10px] text-[#A3A3A3] line-clamp-4 leading-relaxed">
                                            {tpl.snippet}
                                        </p>
                                    </div>
                                    <div className="pt-2 border-t border-[#262626] font-mono-tech text-[9px] text-[#737373] flex justify-between">
                                        <span>{tpl.crdtRev}</span>
                                        <span>TEMPLATE</span>
                                    </div>
                                </div>
                                <span className="font-mono-tech text-xs font-semibold text-[#F5F5F5] group-hover:text-[#F97316] transition-colors">
                                    {tpl.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Divider */}
                <div className="border-t border-[#262626]" />

                {/* Section 2: Recent Documents */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="font-mono-tech text-xs uppercase tracking-widest text-[#F5F5F5] font-bold">
                            Recent documents
                        </h2>

                        {/* Filter Controls */}
                        <div className="flex flex-wrap items-center gap-4 font-mono-tech text-xs text-[#A3A3A3]">
                            <select
                                value={filterOwner}
                                onChange={(e) => setFilterOwner(e.target.value)}
                                className="bg-[#1E1E1E] border border-[#333333] text-[#F5F5F5] px-3 py-1.5 focus:outline-none focus:border-[#F97316]"
                            >
                                <option>Owned by anyone</option>
                                <option>Owned by me</option>
                                <option>Not owned by me</option>
                            </select>

                            <div className="flex items-center gap-2 border border-[#333333] bg-[#1E1E1E] px-2 py-1">
                                <span className="text-white cursor-pointer px-1">
                                    ⊞
                                </span>
                                <span className="text-[#737373] cursor-pointer px-1">
                                    ≡
                                </span>
                                <span className="text-[#737373] cursor-pointer px-1">
                                    A-Z
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Documents Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredDocs.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => handleOpenDoc(doc)}
                                className="group cursor-pointer bg-[#1E1E1E] border border-[#333333] hover:border-[#F97316] transition-all flex flex-col justify-between overflow-hidden shadow-lg"
                            >
                                {/* Thumbnail Preview Area */}
                                <div className="h-40 bg-[#121212] p-4 border-b border-[#262626] flex flex-col justify-between relative group-hover:bg-[#181818] transition-colors">
                                    <div className="space-y-1.5">
                                        <span className="text-white font-semibold font-sans text-xs">
                                            {doc.title}
                                        </span>
                                        <p className="font-mono-tech text-[10px] text-[#A3A3A3] line-clamp-3 leading-relaxed">
                                            {doc.snippet}
                                        </p>
                                    </div>

                                    <div className="font-mono-tech text-[9px] text-[#737373] flex items-center justify-between">
                                        <span className="text-[#F97316]">
                                            {doc.crdtRev}
                                        </span>
                                        <span>SYNCED</span>
                                    </div>
                                </div>

                                {/* Card Footer Info */}
                                <div className="p-4 bg-[#1E1E1E] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {/* Doc Icon */}
                                        <div className="w-4 h-4 bg-[#F97316] flex items-center justify-center text-[9px] text-white font-bold font-mono-tech">
                                            📄
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold font-sans text-xs text-[#F5F5F5] group-hover:text-[#F97316] transition-colors truncate max-w-[150px]">
                                                {doc.title}
                                            </span>
                                            <span className="font-mono-tech text-[10px] text-[#737373]">
                                                {doc.openedDate}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="text-[#A3A3A3] hover:text-white px-1 font-bold">
                                        ⋮
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
