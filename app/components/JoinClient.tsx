"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface JoinClientProps {
    code: string;
}

export function JoinClient({ code }: JoinClientProps) {
    const router = useRouter();

    const [status, setStatus] = useState<"joining" | "success" | "error">("joining");
    const [errorMessage, setErrorMessage] = useState("");
    const [docTitle, setDocTitle] = useState("");

    useEffect(() => {
        const joinDocument = async () => {
            const authServerUrl =
                process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";

            try {
                const res = await fetch(`${authServerUrl}/document/join`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setStatus("success");
                    setDocTitle(data.title || "Document");

                    // Redirect to joined document page
                    setTimeout(() => {
                        if (data.public_id) {
                            router.push(`/workspace/document/${data.public_id}`);
                        } else {
                            router.push("/workspace");
                        }
                    }, 1200);
                } else if (res.status === 401) {
                    // Redirect to login page and return back to join page after login
                    router.push(`/login?redirectUrl=/join/${code}`);
                } else {
                    const data = await res.json().catch(() => ({}));
                    setStatus("error");
                    setErrorMessage(data.error || "Invalid or expired invite code.");
                }
            } catch (err) {
                console.error("Error joining document:", err);
                setStatus("error");
                setErrorMessage("Failed to join document. Please check your connection.");
            }
        };

        if (code) {
            joinDocument();
        }
    }, [code, router]);

    return (
        <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col items-center justify-center font-sans p-4 selection:bg-[#F97316] selection:text-white">
            <div className="w-full max-w-md bg-[#1E1E1E] border border-[#333333] shadow-2xl p-8 space-y-6 text-center relative overflow-hidden">
                <div className="w-12 h-12 bg-[#F97316] flex items-center justify-center mx-auto shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>

                {status === "joining" && (
                    <div className="space-y-4">
                        <div className="w-8 h-8 border-2 border-t-[#F97316] border-[#333333] rounded-full animate-spin mx-auto" />
                        <h2 className="font-mono-tech text-sm uppercase tracking-widest text-[#F5F5F5] font-bold">
                            // JOINING CO-AUTHOR SESSION...
                        </h2>
                        <p className="font-mono-tech text-xs text-[#A3A3A3]">
                            Validating invite code <span className="text-[#F97316] font-bold">{code}</span>
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-[#10B981]/20 border border-[#10B981]/40 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="font-mono-tech text-sm uppercase tracking-widest text-[#10B981] font-bold">
                            // JOIN SUCCESSFUL!
                        </h2>
                        <p className="font-sans text-sm text-[#F5F5F5]">
                            You have successfully joined <strong className="text-white">{docTitle}</strong>.
                        </p>
                        <p className="font-mono-tech text-xs text-[#A3A3A3]">
                            Opening document...
                        </p>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-red-950/40 border border-red-600/40 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="font-mono-tech text-sm uppercase tracking-widest text-red-400 font-bold">
                            // INVITE ERROR
                        </h2>
                        <p className="font-sans text-sm text-[#A3A3A3]">
                            {errorMessage}
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/workspace"
                                className="inline-block font-mono-tech text-xs uppercase px-5 py-2.5 bg-[#F97316] text-white font-bold hover:bg-[#EA580C] transition-colors"
                            >
                                Go to Workspace
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
