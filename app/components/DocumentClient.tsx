"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface DocumentClientProps {
    id: string;
}

enum Type {
    Insert = "insert",
    Delete = "delete",
    Modify = "modify",
}

interface Operation {
    type: Type;
    position: number;
    length?: number;
    text?: string;
}

export function DocumentClient({ id }: DocumentClientProps) {
    const router = useRouter();

    const [title, setTitle] = useState("Loading document...");
    const [content, setContent] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const [accessDenied, setAccessDenied] = useState<{
        title: string;
        message: string;
    } | null>(null);

    // Save states: "idle" | "saving" | "saved" | "error"
    const [saveState, setSaveState] = useState<
        "idle" | "saving" | "saved" | "error"
    >("idle");

    // Modal state for title rename
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [renameTitleInput, setRenameTitleInput] = useState("");

    // Modal state for document sharing
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [permissionInput, setPermissionInput] = useState<"write" | "read">(
        "write",
    );
    const [generatedInviteUrl, setGeneratedInviteUrl] = useState("");
    const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);
    const [copied, setCopied] = useState(false);

    // websocket Connection
    const [socketConnection, setSocketConnection] = useState<WebSocket | null>(
        null,
    );

    const isInitialMount = useRef(true);
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
    const savedTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const ws = new WebSocket(
            `${process.env.NEXT_PUBLIC_WEBSOCKET_SOCKET_URL}/${id}`,
        );
        setSocketConnection(ws);

        ws.onopen = () => {
            console.log("Connection Established");
        };

        ws.onmessage = (event) => {
            const operation = JSON.parse(event.data);

            if (operation == "insert") {
            }

            if (operation == "delete") {
            }

            if (operation == "modify") {
            }
        };

        ws.onclose = () => {
            console.log("Connection Closed");
        };

        ws.onerror = () => {
            console.log("Error!!");
        };

        return () => {
            socketConnection?.close();
        };
    }, []);

    const getOperation = (
        content: string,
        newContent: string,
    ): Operation | null => {
        if (content === newContent) {
            return null;
        }

        let start = 0;
        while (
            content[start] === newContent[start] &&
            start < content.length &&
            start < newContent.length
        ) {
            start++;
        }

        let oldEnd = content.length;
        let newEnd = newContent.length;

        while (
            content[oldEnd] === newContent[newEnd] &&
            oldEnd >= start &&
            newEnd >= start
        ) {
            oldEnd--;
            newEnd--;
        }

        if (oldEnd < start) {
            return {
                type: Type.Insert,
                position: start,
                text: newContent.slice(start, newEnd + 1),
            };
        }

        if (newEnd < start) {
            return {
                type: Type.Delete,
                position: start,
                length: oldEnd - start + 1,
            };
        }

        return {
            type: Type.Modify,
            position: start,
            length: oldEnd - start + 1,
            text: newContent.slice(start, newEnd + 1),
        };
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;

        const operation = getOperation(content, newContent);
        setContent(newContent);

        socketConnection?.send(JSON.stringify(operation));
    };

    // Fetch document from backend API on mount
    useEffect(() => {
        const fetchDocument = async () => {
            const authServerUrl =
                process.env.NEXT_PUBLIC_AUTH_SERVER_URL ||
                "http://localhost:8080";
            try {
                const res = await fetch(
                    `${authServerUrl}/document/fetch?id=${id}`,
                    {
                        method: "GET",
                        credentials: "include",
                    },
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data.document) {
                        setTitle(data.document.title || "Untitled Document");
                        setContent(data.document.content || "");
                    }
                } else if (res.status === 401) {
                    router.push("/login");
                    return;
                } else if (res.status === 403) {
                    const data = await res.json().catch(() => ({}));
                    setAccessDenied({
                        title: "ACCESS DENIED",
                        message:
                            data.error ||
                            "You are not permitted to view this document.",
                    });
                    setTimeout(() => router.push("/workspace"), 2500);
                    return;
                } else if (res.status === 404) {
                    const data = await res.json().catch(() => ({}));
                    setAccessDenied({
                        title: "DOCUMENT NOT FOUND",
                        message:
                            data.error ||
                            "The requested document does not exist.",
                    });
                    setTimeout(() => router.push("/workspace"), 2500);
                    return;
                } else {
                    setAccessDenied({
                        title: "UNABLE TO LOAD DOCUMENT",
                        message: "Failed to load document content.",
                    });
                    setTimeout(() => router.push("/workspace"), 2500);
                    return;
                }
            } catch (err) {
                console.error("Error fetching document:", err);
                setAccessDenied({
                    title: "CONNECTION ERROR",
                    message: "Failed to connect to backend server.",
                });
                setTimeout(() => router.push("/workspace"), 2500);
            } finally {
                setIsLoaded(true);
            }
        };

        fetchDocument();
    }, [id, router]);

    // Save document to backend
    const saveDocument = async (
        customTitle?: string,
        customContent?: string,
    ) => {
        if (accessDenied) return;

        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
            autoSaveTimerRef.current = null;
        }

        const titleToSave = customTitle !== undefined ? customTitle : title;
        const contentToSave =
            customContent !== undefined ? customContent : content;

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
            } else if (res.status === 403) {
                setAccessDenied({
                    title: "ACCESS DENIED",
                    message: "You are not permitted to edit this document.",
                });
                setTimeout(() => router.push("/workspace"), 2500);
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
        if (!isLoaded || accessDenied) return;

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
        }, 4000);

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [content, title, isLoaded, accessDenied]);

    // Handle Title Rename Submission from Modal
    const handleRenameSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedTitle = renameTitleInput.trim() || "Untitled Document";
        setTitle(updatedTitle);
        setIsRenameModalOpen(false);
        saveDocument(updatedTitle, content);
    };

    // Generate Shareable Link using POST /document/invite API
    const handleGenerateShareLink = async () => {
        setIsGeneratingInvite(true);
        const authServerUrl =
            process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";
        try {
            const res = await fetch(`${authServerUrl}/document/invite`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    note_id: id,
                    permission: permissionInput,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.code) {
                    const origin =
                        typeof window !== "undefined"
                            ? window.location.origin
                            : "http://localhost:3000";
                    setGeneratedInviteUrl(`${origin}/join/${data.code}`);
                } else if (data.url) {
                    setGeneratedInviteUrl(data.url);
                }
            } else if (res.status === 401) {
                router.push("/login");
            }
        } catch (err) {
            console.error("Error generating share link:", err);
        } finally {
            setIsGeneratingInvite(false);
        }
    };

    // Copy Shareable Link to Clipboard
    const handleCopyShareLink = () => {
        if (!generatedInviteUrl) return;
        navigator.clipboard.writeText(generatedInviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Word and Character counts
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const charCount = content.length;

    // Loading State
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

    // Access Denied / Not Found Screen
    if (accessDenied) {
        return (
            <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col items-center justify-center font-sans p-4 selection:bg-[#F97316] selection:text-white">
                <div className="w-full max-w-md bg-[#1E1E1E] border border-red-600/60 p-8 space-y-6 text-center shadow-2xl relative overflow-hidden">
                    <div className="w-12 h-12 bg-red-950/50 border border-red-600/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <svg
                            className="w-6 h-6 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-mono-tech text-sm uppercase tracking-widest text-red-400 font-bold">
                            // {accessDenied.title}
                        </h2>
                        <p className="font-sans text-sm text-[#D4D4D4]">
                            {accessDenied.message}
                        </p>
                    </div>

                    <div className="pt-2 space-y-3">
                        <p className="font-mono-tech text-[10px] text-[#A3A3A3] uppercase tracking-wider">
                            Redirecting to workspace in 2 seconds...
                        </p>
                        <Link
                            href="/workspace"
                            className="inline-block font-mono-tech text-xs uppercase px-5 py-2.5 bg-[#F97316] text-white font-bold hover:bg-[#EA580C] transition-colors"
                        >
                            Return to Workspace Now
                        </Link>
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
                        <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
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
                            className="font-mono-tech text-sm tracking-wide font-semibold text-[#F5F5F5] hover:text-[#F97316] cursor-pointer truncate max-w-[180px] sm:max-w-xs md:max-w-md"
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
                            <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Right: Share Button & Direct Interactive Save Button */}
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={() => {
                            setGeneratedInviteUrl("");
                            setCopied(false);
                            setIsShareModalOpen(true);
                        }}
                        className="font-mono-tech text-xs uppercase px-3 py-2 font-bold transition-all border border-[#333333] bg-[#262626] text-[#F5F5F5] hover:bg-[#333333] flex items-center gap-1.5"
                    >
                        <svg
                            className="w-3.5 h-3.5 text-[#F97316]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                            />
                        </svg>
                        <span>Share</span>
                    </button>

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
                                <svg
                                    className="w-3.5 h-3.5 animate-spin"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                <span>Saving...</span>
                            </>
                        ) : saveState === "saved" ? (
                            <>
                                <svg
                                    className="w-3.5 h-3.5 text-[#10B981]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <span>Saved</span>
                            </>
                        ) : saveState === "error" ? (
                            <>
                                <svg
                                    className="w-3.5 h-3.5 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Save Failed</span>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                                    />
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
                        WORDS:{" "}
                        <strong className="text-[#F5F5F5]">{wordCount}</strong>
                    </span>
                    <span>
                        CHARS:{" "}
                        <strong className="text-[#F5F5F5]">{charCount}</strong>
                    </span>
                </div>
            </div>

            {/* Clean Editor Canvas */}
            <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8">
                <div className="w-full bg-[#1E1E1E] border border-[#333333] shadow-2xl p-6 md:p-8 flex flex-col min-h-[600px]">
                    <textarea
                        value={content}
                        onChange={handleChange}
                        className="w-full flex-1 bg-transparent text-[#F5F5F5] font-sans text-base md:text-lg leading-relaxed focus:outline-none resize-none min-h-[540px] selection:bg-[#F97316] selection:text-white"
                        placeholder="Start typing your document here..."
                        autoFocus
                    />
                </div>
            </main>

            {/* Share Document Modal Dialog */}
            {isShareModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#1E1E1E] border border-[#F97316] p-6 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                            <h3 className="font-mono-tech text-sm uppercase text-[#F5F5F5] font-bold flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 text-[#F97316]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                </svg>
                                <span>// Share Document</span>
                            </h3>
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="text-[#A3A3A3] hover:text-white p-1"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block font-mono-tech text-xs uppercase text-[#A3A3A3]">
                                    Access Permission
                                </label>
                                <select
                                    value={permissionInput}
                                    onChange={(e) =>
                                        setPermissionInput(
                                            e.target.value as "write" | "read",
                                        )
                                    }
                                    className="w-full px-4 py-3 bg-[#121212] border border-[#333333] font-mono-tech text-sm text-[#F5F5F5] focus:outline-none focus:border-[#F97316]"
                                >
                                    <option value="write">
                                        Can Edit (Full Access)
                                    </option>
                                    <option value="read">
                                        Can View (Read-only Access)
                                    </option>
                                </select>
                            </div>

                            {!generatedInviteUrl ? (
                                <button
                                    type="button"
                                    onClick={handleGenerateShareLink}
                                    disabled={isGeneratingInvite}
                                    className="w-full py-3 bg-[#F97316] text-white font-mono-tech text-xs uppercase font-bold hover:bg-[#EA580C] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isGeneratingInvite ? (
                                        <>
                                            <svg
                                                className="w-4 h-4 animate-spin"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Generating Link...</span>
                                        </>
                                    ) : (
                                        <span>Generate Shareable Link</span>
                                    )}
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <label className="block font-mono-tech text-xs uppercase text-[#A3A3A3]">
                                        Shareable Invite Link
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={generatedInviteUrl}
                                            className="flex-1 px-3 py-2 bg-[#121212] border border-[#333333] font-mono-tech text-xs text-[#F97316] focus:outline-none select-all"
                                        />
                                        <button
                                            onClick={handleCopyShareLink}
                                            className="px-4 py-2 bg-[#262626] text-white font-mono-tech text-xs uppercase font-bold hover:bg-[#333333] border border-[#333333] shrink-0"
                                        >
                                            {copied ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="pt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsShareModalOpen(false)}
                                    className="px-4 py-2 font-mono-tech text-xs uppercase text-[#A3A3A3] hover:text-white border border-[#333333]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={handleRenameSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="block font-mono-tech text-xs uppercase text-[#A3A3A3]">
                                    New Document Title
                                </label>
                                <input
                                    type="text"
                                    value={renameTitleInput}
                                    onChange={(e) =>
                                        setRenameTitleInput(e.target.value)
                                    }
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
                                    <svg
                                        className="w-3.5 h-3.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
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
