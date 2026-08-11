"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import getServerSession from "../auth/auth";

export async function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{
        type: "error" | "success";
        text: string;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            setStatusMsg({
                type: "error",
                text: "INVALID_INPUT // USERNAME AND PASSWORD REQUIRED",
            });
            return;
        }

        const authServerUrl =
            process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";

        setIsLoading(true);
        setStatusMsg(null);

        try {
            const res = await fetch(`${authServerUrl}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatusMsg({
                    type: "success",
                    text: "AUTHENTICATED // REDIRECTING TO WORKSPACE...",
                });
                router.push("/workspace");
            } else {
                setIsLoading(false);
                setStatusMsg({
                    type: "error",
                    text: `LOGIN_FAILED // ${data.status || data.error || "INVALID CREDENTIALS"}`,
                });
            }
        } catch (err) {
            setIsLoading(false);
            setStatusMsg({
                type: "error",
                text: "CONNECTION_FAILED // UNABLE TO REACH AUTHENTICATION SERVER",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#F97316]">
                    // LOGIN IDENT
                </span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#F5F5F5]">
                    Sign In to Account
                </h2>
            </div>

            {/* Status notification banner */}
            {statusMsg && (
                <div
                    className={`p-3 border font-mono-tech text-xs ${
                        statusMsg.type === "error"
                            ? "border-red-600 bg-red-950/40 text-red-400"
                            : "border-[#F97316] bg-orange-950/40 text-[#F97316]"
                    }`}
                >
                    {statusMsg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Input */}
                <div className="space-y-1.5">
                    <label className="block font-mono-tech text-xs uppercase text-[#F5F5F5] tracking-wider">
                        Username <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="abhishekraj_0534"
                        required
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333333] font-mono-tech text-sm text-[#F5F5F5] focus:bg-[#181818] focus:border-[#F97316] focus:outline-none transition-colors"
                    />
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="block font-mono-tech text-xs uppercase text-[#F5F5F5] tracking-wider">
                            Password <span className="text-[#F97316]">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="font-mono-tech text-[10px] uppercase text-[#A3A3A3] hover:text-[#F5F5F5]"
                        >
                            [{showPassword ? "HIDE" : "SHOW"}]
                        </button>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333333] font-mono-tech text-sm text-[#F5F5F5] focus:bg-[#181818] focus:border-[#F97316] focus:outline-none transition-colors"
                    />
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between font-mono-tech text-xs text-[#F5F5F5]">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded-none accent-[#F97316]"
                        />
                        <span>Remember Session</span>
                    </label>

                    <a
                        href="#"
                        className="text-[#A3A3A3] hover:text-[#F97316] transition-colors"
                    >
                        Forgot Password?
                    </a>
                </div>

                {/* Submit Action Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#F5F5F5] text-[#121212] font-bold font-mono-tech text-xs uppercase tracking-widest hover:bg-[#F97316] hover:text-white transition-colors border border-[#F5F5F5] hover:border-[#F97316] disabled:opacity-50"
                >
                    {isLoading ? "AUTHENTICATING..." : "SIGN IN TO SESSION →"}
                </button>
            </form>

            {/* Link to Sign Up */}
            <div className="pt-4 border-t border-[#333333] text-center font-mono-tech text-xs text-[#A3A3A3]">
                Need a new account?{" "}
                <Link
                    href="/signup"
                    className="text-[#F5F5F5] font-bold hover:text-[#F97316] underline"
                >
                    [Sign Up]
                </Link>
            </div>
        </div>
    );
}
