import Link from "next/link";
import { TechnicalAnnotation } from "../components/TechnicalAnnotation";
import { LoginForm } from "../components/LoginForm";
import getServerSession from "../auth/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await getServerSession();
    if (session) {
        redirect("/workspace");
    }
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
                    label="SESSION"
                    value="AUTH_LOGIN"
                    variant="dark"
                />
            </header>

            {/* Main Content Layout - Server-side Rendered 50/50 Grid */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-8">
                <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 border border-[#333333] bg-[#1E1E1E] shadow-2xl overflow-hidden">
                    {/* Left Column: Server-Side Geometric Graphic & Annotations (50% ratio) */}
                    <div className="lg:col-span-6 bg-[#0A0A0A] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[380px] lg:min-h-[540px]">
                        {/* Background Stepped Pixel Decoration */}
                        <div className="absolute inset-0 pointer-events-none opacity-20">
                            <svg
                                className="w-full h-full text-white"
                                viewBox="0 0 400 400"
                                fill="currentColor"
                            >
                                <path d="M 100 0 H 400 V 400 H 200 V 300 H 250 V 250 H 150 V 180 H 100 Z" />
                            </svg>
                            <div className="absolute top-8 left-8 font-mono-tech text-[10px] text-[#A3A3A3]">
                                <span>01</span> <span className="ml-4">02</span>{" "}
                                <span className="ml-8">03</span>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4">
                            <TechnicalAnnotation
                                label="AUTH 001"
                                value="ENTER SESSION"
                                variant="accent"
                            />
                            <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight leading-none text-white">
                                Access your <br />
                                workspace.
                            </h1>
                            <p className="font-mono-tech text-xs text-[#A3A3A3] leading-relaxed max-w-sm">
                                Enter your credentials to access your personal
                                workspace, manage your notes, and synchronize
                                changes.
                            </p>
                        </div>

                        {/* Bottom Technical Status */}
                        <div className="relative z-10 pt-8 border-t border-[#262626] font-mono-tech text-[10px] text-[#737373] flex items-center justify-between">
                            <span>PROTOCOL: TLS_WSS</span>
                            <span>REV: 0184</span>
                        </div>
                    </div>

                    {/* Right Column: Client-Side Interactive Form Component (50% ratio) */}
                    <div className="lg:col-span-6 p-8 md:p-12 bg-[#1E1E1E] flex flex-col justify-center">
                        <LoginForm />
                    </div>
                </div>
            </main>

            {/* Footer minimal bar */}
            <footer className="w-full border-t border-[#262626] bg-[#121212] py-3 px-4 md:px-8 text-center font-mono-tech text-[10px] text-[#737373]">
                COLLABNOTE AUTH // SYSTEM READY 0x4F92
            </footer>
        </div>
    );
}
