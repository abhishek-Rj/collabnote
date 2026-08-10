import React from "react";
import Link from "next/link";
import { TechnicalAnnotation } from "./TechnicalAnnotation";

export function Footer() {
    return (
        <footer className="w-full border-t border-[#262626] bg-[#0A0A0A] text-[#F5F5F5] pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#262626]">
                    {/* Brand Column */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 bg-[#F5F5F5] flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 bg-[#F97316]" />
                            </div>
                            <span className="font-bold text-base uppercase tracking-wider text-white">
                                CollabNote
                            </span>
                        </div>
                        <p className="font-mono-tech text-xs text-[#A3A3A3] max-w-md leading-relaxed">
                            An experimental, editorial collaborative editor.
                            High-frequency state vector synchronization without
                            handoffs or UI distraction.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <TechnicalAnnotation
                                label="STATUS"
                                value="NORMAL"
                                variant="accent"
                            />
                            <TechnicalAnnotation
                                label="LATENCY"
                                value="< 4ms"
                                variant="light"
                            />
                        </div>
                    </div>

                    {/* Navigation Index */}
                    <div className="space-y-3">
                        <h4 className="font-mono-tech text-xs uppercase tracking-widest text-[#A3A3A3]">
                            // INDEX
                        </h4>
                        <ul className="space-y-2 font-mono-tech text-xs">
                            <li>
                                <Link
                                    href="#features"
                                    className="hover:text-[#F97316] transition-colors"
                                >
                                    01. Capabilities
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#demo"
                                    className="hover:text-[#F97316] transition-colors"
                                >
                                    02. Engine Demo
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#specs"
                                    className="hover:text-[#F97316] transition-colors"
                                >
                                    03. Technical Specs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Auth Routes */}
                    <div className="space-y-3">
                        <h4 className="font-mono-tech text-xs uppercase tracking-widest text-[#A3A3A3]">
                            // ACCESS
                        </h4>
                        <ul className="space-y-2 font-mono-tech text-xs">
                            <li>
                                <Link
                                    href="/login"
                                    className="hover:text-[#F97316] transition-colors"
                                >
                                    Login to Workspace
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/signup"
                                    className="hover:text-[#F97316] transition-colors"
                                >
                                    Create New Account
                                </Link>
                            </li>
                            <li>
                                <span className="text-[#525252]">
                                    API Docs (v1)
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Technical Metadata Bar */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between font-mono-tech text-[10px] text-[#737373] gap-4">
                    <div>
                        © {new Date().getFullYear()} COLLABNOTE // ALL RIGHTS
                        RESERVED
                    </div>

                    <div className="flex items-center gap-6">
                        <span>REV 018</span>
                        <span>SYNC 0042</span>
                        <span>X 042 Y 018</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
