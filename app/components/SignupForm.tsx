"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SignupForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{
        type: "error" | "success";
        text: string;
    } | null>(null);

    // Compute password strength bars (0 to 4)
    const getPasswordStrength = () => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength = getPasswordStrength();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password || !confirmPassword) {
            setStatusMsg({
                type: "error",
                text: "INVALID_INPUT // ALL FIELDS REQUIRED",
            });
            return;
        }

        if (password !== confirmPassword) {
            setStatusMsg({
                type: "error",
                text: "MISMATCH // PASSWORDS DO NOT MATCH",
            });
            return;
        }

        if (password.length < 8) {
            setStatusMsg({
                type: "error",
                text: "WEAK_PASSWORD // MINIMUM 8 CHARACTERS REQUIRED",
            });
            return;
        }

        const authServerUrl =
            process.env.NEXT_PUBLIC_AUTH_SERVER_URL || "http://localhost:8080";

        setIsLoading(true);
        setStatusMsg(null);

        try {
            const res = await fetch(`${authServerUrl}/auth/signin`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                setStatusMsg({
                    type: "success",
                    text: "ACCOUNT CREATED // REDIRECTING TO WORKSPACE...",
                });
                setTimeout(() => {
                    router.push("/workspace");
                }, 600);
            } else {
                setIsLoading(false);
                setStatusMsg({
                    type: "error",
                    text: `REGISTRATION_FAILED // ${data.status || data.error || "USER ALREADY EXISTS OR INVALID DATA"}`,
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
                    // CREATE ACCOUNT
                </span>
                <h2 className="text-2xl font-bold uppercase tracking-tight text-[#F5F5F5]">
                    Register New Account
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

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <label className="block font-mono-tech text-xs uppercase text-[#F5F5F5] tracking-wider">
                        Password <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        required
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333333] font-mono-tech text-sm text-[#F5F5F5] focus:bg-[#181818] focus:border-[#F97316] focus:outline-none transition-colors"
                    />

                    {/* Stepped Password Strength Bar */}
                    {password && (
                        <div className="pt-1.5 flex items-center gap-1">
                            {[1, 2, 3, 4].map((step) => (
                                <div
                                    key={step}
                                    className={`h-1.5 flex-1 transition-colors ${
                                        strength >= step
                                            ? strength >= 3
                                                ? "bg-[#F97316]"
                                                : "bg-[#F5F5F5]"
                                            : "bg-[#333333]"
                                    }`}
                                />
                            ))}
                            <span className="font-mono-tech text-[9px] text-[#A3A3A3] ml-2">
                                STRENGTH: {strength}/4
                            </span>
                        </div>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                    <label className="block font-mono-tech text-xs uppercase text-[#F5F5F5] tracking-wider">
                        Confirm Password{" "}
                        <span className="text-[#F97316]">*</span>
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        required
                        className="w-full px-4 py-3 bg-[#121212] border border-[#333333] font-mono-tech text-sm text-[#F5F5F5] focus:bg-[#181818] focus:border-[#F97316] focus:outline-none transition-colors"
                    />
                </div>

                {/* Submit Action Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-[#F5F5F5] text-[#121212] font-bold font-mono-tech text-xs uppercase tracking-widest hover:bg-[#F97316] hover:text-white transition-colors border border-[#F5F5F5] hover:border-[#F97316] disabled:opacity-50 mt-2"
                >
                    {isLoading ? "CREATING WORKSPACE..." : "CREATE ACCOUNT →"}
                </button>
            </form>

            {/* Link to Login */}
            <div className="pt-4 border-t border-[#333333] text-center font-mono-tech text-xs text-[#A3A3A3]">
                Already have an account?{" "}
                <Link
                    href="/login"
                    className="text-[#F5F5F5] font-bold hover:text-[#F97316] underline"
                >
                    [Sign In]
                </Link>
            </div>
        </div>
    );
}
