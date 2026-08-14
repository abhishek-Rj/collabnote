"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TechnicalAnnotation } from "./TechnicalAnnotation";
import { useSession } from "../context/session";

interface NoteItem {
    id: string;
    public_id: string;
    title: string;
    content: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export function WorkspaceClient() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOwner, setFilterOwner] = useState("Owned by anyone");
    const [notes, setNotes] = useState<NoteItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state for creating a new document with custom title
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newDocTitle, setNewDocTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const { user } = useSession();

    // Fetch user documents (owned and joined) from backend
    const fetchAllDocs = async () => {
        setIsLoading(true);
        const authServerUrl =
            process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";
        try {
            const res = await fetch(`${authServerUrl}/document/fetch-all-docs`, {
                method: "GET",
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                if (data.notes && Array.isArray(data.notes)) {
                    setNotes(data.notes);
                }
            } else if (res.status === 401) {
                router.push("/login");
            }
        } catch (err) {
            console.error("Failed to fetch joined documents:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDocs();
    }, []);

    // Create a new document on backend and redirect using returned public_id
    const handleCreateDocumentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        const authServerUrl =
            process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";
        const titleToSend = newDocTitle.trim() || "Untitled document";

        try {
            const res = await fetch(`${authServerUrl}/document/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: titleToSend, content: "" }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.document && data.document.public_id) {
                    router.push(`/workspace/document/${data.document.public_id}`);
                    return;
                }
            } else if (res.status === 401) {
                router.push("/login");
                return;
            } else {
                console.error("Failed to create document: HTTP status", res.status);
            }
        } catch (err) {
            console.error("Failed to create document:", err);
        } finally {
            setIsCreating(false);
            setIsCreateModalOpen(false);
        }
    };

    const handleLogout = async () => {
        const authServerUrl =
            process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";
        try {
            await fetch(`${authServerUrl}/auth/logout`, {
                method: "GET",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout request failed:", err);
        }
        router.push("/login");
    };

    // Filter documents by owner and search query
    const filteredDocs = notes.filter((doc) => {
        const matchesSearch =
            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.content.toLowerCase().includes(searchQuery.toLowerCase());

        const currentUserId = user?.userID;
        if (filterOwner === "Owned by me") {
            return matchesSearch && doc.owner_id === currentUserId;
        }
        if (filterOwner === "Not owned by me") {
            return matchesSearch && doc.owner_id !== currentUserId;
        }
        return matchesSearch;
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Just now";
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#F97316] selection:text-white">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-[#121212] border-b border-[#262626] px-4 md:px-6 h-16 flex items-center justify-between gap-4">
                {/* Left: Logo */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-7 h-7 bg-[#F5F5F5] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                            <div className="w-2.5 h-2.5 bg-[#F97316]" />
                        </div>
                        <span className="font-bold text-base tracking-tight text-[#F5F5F5] uppercase">
                            CollabNote{" "}
                            <span className="text-[#A3A3A3] text-xs font-normal">
                                Workspace
                            </span>
                        </span>
                    </Link>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-2xl mx-2 md:mx-6">
                    <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-[#A3A3A3] pointer-events-none">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search your documents..."
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1E1E1E] border border-[#333333] font-mono-tech text-xs text-[#F5F5F5] placeholder-[#737373] focus:outline-none focus:border-[#F97316] transition-colors shadow-inner"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 text-[#A3A3A3] hover:text-white p-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-3 shrink-0">
                    <TechnicalAnnotation
                        label="WORKSPACE"
                        value="ACTIVE"
                        variant="accent"
                        className="hidden sm:inline-flex"
                    />

                    <button
                        onClick={handleLogout}
                        className="font-mono-tech text-xs uppercase px-3 py-1.5 bg-[#262626] text-[#A3A3A3] hover:text-white hover:bg-[#333333] border border-[#333333] transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-8">
                {/* Header Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262626]">
                    <div>
                        <h1 className="text-2xl font-bold uppercase tracking-tight text-[#F5F5F5]">
                            Your Workspace
                        </h1>
                        <p className="font-mono-tech text-xs text-[#A3A3A3] mt-1">
                            Manage documents you own or are collaborating on.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setNewDocTitle("");
                            setIsCreateModalOpen(true);
                        }}
                        className="font-mono-tech text-xs uppercase px-5 py-3 bg-[#F97316] text-white font-bold hover:bg-[#EA580C] transition-colors border border-[#F97316] tracking-wider shadow-lg flex items-center justify-center gap-2 self-start sm:self-auto"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Create Document</span>
                    </button>
                </div>

                {/* Section: Documents Grid & Filters */}
                <section className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="font-mono-tech text-xs uppercase tracking-widest text-[#F5F5F5] font-bold">
                            All Documents ({filteredDocs.length})
                        </div>

                        {/* Filter Controls */}
                        <div className="flex items-center gap-4 font-mono-tech text-xs text-[#A3A3A3]">
                            <select
                                value={filterOwner}
                                onChange={(e) => setFilterOwner(e.target.value)}
                                className="bg-[#1E1E1E] border border-[#333333] text-[#F5F5F5] px-3 py-1.5 focus:outline-none focus:border-[#F97316]"
                            >
                                <option>Owned by anyone</option>
                                <option>Owned by me</option>
                                <option>Not owned by me</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="py-16 text-center space-y-3">
                            <div className="w-8 h-8 border-2 border-t-[#F97316] border-[#333333] rounded-full animate-spin mx-auto" />
                            <p className="font-mono-tech text-xs text-[#A3A3A3] uppercase">
                                Loading documents...
                            </p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && filteredDocs.length === 0 && (
                        <div className="py-16 px-4 text-center border border-dashed border-[#333333] bg-[#1E1E1E]/50 space-y-4">
                            <div className="font-mono-tech text-xs text-[#A3A3A3] uppercase">
                                {searchQuery
                                    ? "No documents match your search query."
                                    : "No documents found in your workspace."}
                            </div>
                            <button
                                onClick={() => {
                                    setNewDocTitle("");
                                    setIsCreateModalOpen(true);
                                }}
                                className="font-mono-tech text-xs uppercase px-4 py-2 bg-[#F5F5F5] text-[#121212] font-bold hover:bg-[#F97316] hover:text-white transition-colors inline-flex items-center gap-1.5"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Create Your First Document</span>
                            </button>
                        </div>
                    )}

                    {/* Real Documents Grid */}
                    {!isLoading && filteredDocs.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {filteredDocs.map((doc) => {
                                const isOwner =
                                    user && doc.owner_id === user.userID;
                                return (
                                    <div
                                        key={doc.id || doc.public_id}
                                        onClick={() =>
                                            router.push(
                                                `/workspace/document/${doc.public_id}`,
                                            )
                                        }
                                        className="group cursor-pointer bg-[#1E1E1E] border border-[#333333] hover:border-[#F97316] transition-all flex flex-col justify-between overflow-hidden shadow-lg"
                                    >
                                        {/* Card Top Preview */}
                                        <div className="h-40 bg-[#121212] p-4 border-b border-[#262626] flex flex-col justify-between relative group-hover:bg-[#181818] transition-colors">
                                            <div className="space-y-1.5">
                                                <span className="text-white font-semibold font-sans text-xs line-clamp-1">
                                                    {doc.title || "Untitled Document"}
                                                </span>
                                                <p className="font-mono-tech text-[10px] text-[#A3A3A3] line-clamp-3 leading-relaxed">
                                                    {doc.content ||
                                                        "No content yet..."}
                                                </p>
                                            </div>

                                            <div className="font-mono-tech text-[9px] text-[#737373] flex items-center justify-between">
                                                <span className="text-[#F97316] truncate max-w-[120px]">
                                                    ID: {doc.public_id.slice(0, 8)}
                                                </span>
                                                <span>
                                                    {isOwner ? "OWNER" : "JOINED"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Footer Info */}
                                        <div className="p-4 bg-[#1E1E1E] flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 bg-[#F97316] flex items-center justify-center text-white shrink-0">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold font-sans text-xs text-[#F5F5F5] group-hover:text-[#F97316] transition-colors truncate max-w-[140px]">
                                                        {doc.title ||
                                                            "Untitled Document"}
                                                    </span>
                                                    <span className="font-mono-tech text-[10px] text-[#737373]">
                                                        {formatDate(
                                                            doc.updated_at ||
                                                                doc.created_at,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>

            {/* Create Document Title Input Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-[#1E1E1E] border border-[#F97316] p-6 space-y-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#333333] pb-3">
                            <h3 className="font-mono-tech text-sm uppercase text-[#F5F5F5] font-bold">
                                // Create New Document
                            </h3>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-[#A3A3A3] hover:text-white p-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form
                            onSubmit={handleCreateDocumentSubmit}
                            className="space-y-4"
                        >
                            <div className="space-y-1.5">
                                <label className="block font-mono-tech text-xs uppercase text-[#A3A3A3]">
                                    Document Title
                                </label>
                                <input
                                    type="text"
                                    value={newDocTitle}
                                    onChange={(e) => setNewDocTitle(e.target.value)}
                                    placeholder="e.g. Architecture Spec"
                                    autoFocus
                                    className="w-full px-4 py-3 bg-[#121212] border border-[#333333] font-mono-tech text-sm text-[#F5F5F5] focus:outline-none focus:border-[#F97316]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 font-mono-tech text-xs uppercase text-[#A3A3A3] hover:text-white border border-[#333333]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="px-5 py-2 font-mono-tech text-xs uppercase bg-[#F97316] text-white font-bold hover:bg-[#EA580C] disabled:opacity-50 flex items-center gap-1.5"
                                >
                                    <span>{isCreating ? "Creating..." : "Create"}</span>
                                    {!isCreating && (
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
