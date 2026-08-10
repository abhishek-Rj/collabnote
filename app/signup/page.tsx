import React from "react";
import Link from "next/link";
import { TechnicalAnnotation } from "../components/TechnicalAnnotation";
import { SignupForm } from "../components/SignupForm";

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-[#121212] text-[#F5F5F5] flex flex-col justify-between selection:bg-[#F97316] selection:text-white">
            {/* Top Header Bar */}
            <header className="w-full border-b border-[#262626] bg-[#121212] px-4 md:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    {/* Standardized White Box Logo Mark with Inner Orange Square */}
                    <div className="w-6 h-6 bg-[#F5F5F5] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                        <div className="w-2.5 h-2.5 bg-[#F97316]" />
                    </div>
                    <span className="font-bold text-sm tracking-tight text-[#F5F5F5] uppercase">
                        CollabNote
                    </span>
                </Link>

                <TechnicalAnnotation
                    label="REGISTRATION"
                    value="CREATE_ACCOUNT"
                    variant="dark"
                />
            </header>

            {/* Main Content Layout - Server-side Rendered 50/50 Grid */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 border border-[#333333] bg-[#1E1E1E] shadow-2xl overflow-hidden">
                    {/* Left Column: Server-Side Geometric Graphic & Annotations (50% ratio) */}
                    <div className="lg:col-span-6 bg-[#0A0A0A] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[380px] lg:min-h-[540px]">
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                            <svg
                                className="w-full h-full text-white"
                                viewBox="0 0 400 400"
                                fill="currentColor"
                            >
                                <path d="M 0 100 H 300 V 400 H 100 V 300 H 50 V 200 H 0 Z" />
                            </svg>
                            <div className="absolute bottom-8 right-8 font-mono-tech text-[10px] text-[#A3A3A3]">
                                <span>01</span> <span className="ml-4">02</span>{" "}
                                <span className="ml-8">03</span>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <TechnicalAnnotation
                                label="REG 002"
                                value="NEW WORKSPACE"
                                variant="accent"
                            />
                            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight leading-none text-white">
                                Create your <br />
                                workspace.
                            </h1>
                            <p className="font-mono-tech text-xs text-[#A3A3A3] leading-relaxed max-w-sm">
                                Register your account to initialize your
                                personal collaborative workspace, create
                                documents, and invite team members.
                            </p>
                        </div>

                        {/* Bottom Technical Status */}
                        <div className="relative z-10 space-y-2 font-mono-tech text-[10px] text-[#A3A3A3] border-t border-[#262626] pt-6">
                            <div className="flex justify-between">
                                <span>ENCRYPTION VECTOR:</span>
                                <span className="text-white">AES-256</span>
                            </div>
                            <div className="flex justify-between">
                                <span>PROTOCOL:</span>
                                <span className="text-[#F97316]">
                                    TLS_WSS // CRDT V1
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Client-Side Interactive Form Component (50% ratio) */}
                    <div className="lg:col-span-6 p-8 md:p-12 bg-[#1E1E1E] flex flex-col justify-center">
                        <SignupForm />
                    </div>
                </div>
            </main>

            {/* Footer minimal bar */}
            <footer className="w-full border-t border-[#262626] bg-[#121212] py-3 px-4 md:px-8 text-center font-mono-tech text-[10px] text-[#737373]">
                COLLABNOTE REGISTRATION // SYSTEM READY 0x4F92
            </footer>
        </div>
    );
}
