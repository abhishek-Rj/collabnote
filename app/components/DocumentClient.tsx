"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DocumentClientProps {
    id: string; // public_id or database ID
}

export function DocumentClient({ id }: DocumentClientProps) {
    const router = useRouter();

    const [title, setTitle] = useState("Loading document...");
    const [content, setContent] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    // Save states: "idle" | "saving" | "saved" | "error"
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");

    // Modal state for title rename
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [renameTitleInput, setRenameTitleInput] = useState("");

    const isInitialMount = useRef(true);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const savedTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch document from backend API on mount
    useEffect(() => {
        const fetchDocument = async () => {
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
                        setTitle(data.document.title || "Untitled Document");
                        setContent(data.document.content || "");
                    }
                } else if (res.status === 401) {
                    router.push("/login");
                    return;
                } else {
                    setTitle("Untitled Document");
                }
            } catch (err) {
                console.error("Error fetching document:", err);
                setTitle("Untitled Document");
            } finally {
                setIsLoaded(true);
            }
        };

        fetchDocument();
    }, [id, router]);

    // Save document to backend
    const saveDocument = async (customTitle?: string, customContent?: string) => {
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = null;
        }

        const titleToSave = customTitle !== undefined ? customTitle : title;
        const contentToSave = customContent !== undefined ? customContent : content;

        setSaveState("saving");

        const authServerUrl =
            process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";
        try {
            const res = await fetch(`${authServerUrl}/document/update`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    title: titleToSave,
                    content: contentToSave,
                }),
            });
            if (res.ok) {
                setSaveState("saved");
                if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
                savedTimerRef.current = setTimeout(() => {
                    setSaveState("idle");
                }, 3000);
            } else if (res.status === 401) {
                router.push("/login");
            } else {
                setSaveState("error");
            }
        } catch (err) {
            console.error("Autosave error:", err);
            setSaveState("error");
        }
    };

    // 4-second debounced autosave timer triggered 4 seconds after the last onChange event
    useEffect(() => {
        if (!isLoaded) return;

        // Skip saving on initial document load
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        autoSaveTimerRef.current = setTimeout(() => {
            saveDocument(title, content);
        }, 4000); // Wait 4 seconds after last keypress

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [content, title, isLoaded]);

    // Handle Title Rename Submission from Modal
    const handleRenameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTitle = renameTitleInput.trim() || "Untitled Document";
        setTitle(updatedTitle);
        setIsRenameModalOpen(false);
        saveDocument(updatedTitle, content);
    };

    // Word and Character counts
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const charCount = content.length;

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex items-center justify-center font-sans">
                <div className="space-y-4 text-center">
                    <div className="w-10 h-10 border-4 border-t-[#F97316] border-[#333333] rounded-full animate-spin mx-auto" />
                    <div className="font-mono-tech text-xs tracking-widest text-[#A3A3A3] uppercase">
                        LOADING DOCUMENT...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#F97316] selection:text-white">
            {/* Top Toolbar / Header */}
            <header className="sticky top-0 z-40 bg-[#121212] border-b border-[#262626] px-4 md:px-6 h-16 flex items-center justify-between gap-4">
                {/* Left: Back button & Document Title */}
                <div className="flex items-center gap-4 min-w-0">
                    <Link
                        href="/workspace"
                        className="font-mono-tech text-xs uppercase px-3 py-1.5 bg-[#262626] text-[#A3A3A3] hover:text-white hover:bg-[#333333] border border-[#333333] transition-colors shrink-0 flex items-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>WORKSPACE</span>
                    </Link>

                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 bg-[#F97316] shrink-0" />
                        <h1
                            onClick={() => {
                                setRenameTitleInput(title);
                                setIsRenameModalOpen(true);
                            }}
                            className="font-mono-tech text-sm tracking-wide font-semibold text-[#F5F5F5] hover:text-[#F97316] cursor-pointer truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                            title="Click to rename title"
                        >
                            {title}
                        </h1>
                        <button
                            onClick={() => {
                                setRenameTitleInput(title);
                                setIsRenameModalOpen(true);
                            }}
                            className="p-1 text-[#A3A3A3] hover:text-[#F97316] transition-colors shrink-0"
                            title="Rename Title"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right: Direct Interactive Save Button */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => saveDocument(title, content)}
                        disabled={saveState === "saving"}
                        className={`font-mono-tech text-xs uppercase px-4 py-2 font-bold transition-all border flex items-center gap-2 ${
                            saveState === "saved"
                                ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                                : saveState === "saving"
                                ? "bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40 cursor-wait"
                                : saveState === "error"
                                ? "bg-red-950/40 text-red-400 border-red-600/40 hover:bg-red-900/50"
                                : "bg-[#F97316] text-white border-[#F97316] hover:bg-[#EA580C]"
                        }`}
                    >
                        {saveState === "saving" ? (
                            <>
                                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Saving...</span>
                            </>
                        ) : saveState === "saved" ? (
                            <>
                                <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Saved</span>
                            </>
                        ) : saveState === "error" ? (
                            <>
                                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Save Failed</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                <span>Save</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Sub-Header Bar: Metadata & Stats */}
            <div className="bg-[#181818] border-b border-[#262626] px-4 md:px-6 py-2 flex items-center justify-between font-mono-tech text-xs text-[#A3A3A3]">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                    <span className="uppercase text-[10px] tracking-widest font-semibold text-[#A3A3A3]">
                        ID: {id}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider">
                    <span>
                        WORDS: <strong className="text-[#F5F5F5]">{wordCount}</strong>
                    </span>
                    <span>
                        CHARS: <strong className="text-[#F5F5F5]">{charCount}</strong>
                    </span>
                </div>
            </div>

            {/* Clean Editor Canvas */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8">
                <div className="w-full bg-[#1E1E1E] border border-[#333333] shadow-2xl p-6 md:p-8 flex flex-col min-h-[600px]">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full flex-1 bg-transparent text-[#F5F5F5] font-sans text-base md:text-lg leading-relaxed focus:outline-none resize-none min-h-[540px] selection:bg-[#F97316] selection:text-white"
                        placeholder="Start typing your document here..."
                        autoFocus
                    />
                </div>
            </main>

            {/* Rename Title Modal Dialog */}
            {isRenameModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#1E1E1E] border border-[#F97316] p-6 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                            <h3 className="font-mono-tech text-sm uppercase text-[#F5F5F5] font-bold">
                                // Rename Document Title
                            </h3>
                            <button
                                onClick={() => setIsRenameModalOpen(false)}
                                className="text-[#A3A3A3] hover:text-white p-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleRenameSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block font-mono-tech text-xs uppercase text-[#A3A3A3]">
                                    New Document Title
                                </label>
                                <input
                                    type="text"
                                    value={renameTitleInput}
                                    onChange={(e) => setRenameTitleInput(e.target.value)}
                                    placeholder="Enter title..."
                                    autoFocus
                                    className="w-full px-4 py-3 bg-[#121212] border border-[#333333] font-mono-tech text-sm text-[#F5F5F5] focus:outline-none focus:border-[#F97316]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRenameModalOpen(false)}
                                    className="px-4 py-2 font-mono-tech text-xs uppercase text-[#A3A3A3] hover:text-white border border-[#333333]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 font-mono-tech text-xs uppercase bg-[#F97316] text-white font-bold hover:bg-[#EA580C] flex items-center gap-1.5"
                                >
                                    <span>Save Title</span>
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
