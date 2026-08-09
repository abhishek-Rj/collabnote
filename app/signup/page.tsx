"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TechnicalAnnotation } from "../components/TechnicalAnnotation";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "error" | "success"; text: string } | null>(null);

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
    if (!fullName || !email || !password || !confirmPassword) {
      setStatusMsg({ type: "error", text: "INVALID_INPUT // ALL FIELDS REQUIRED" });
      return;
    }

    if (password !== confirmPassword) {
      setStatusMsg({ type: "error", text: "MISMATCH // PASSWORDS DO NOT MATCH" });
      return;
    }

    if (password.length < 8) {
      setStatusMsg({ type: "error", text: "WEAK_PASSWORD // MINIMUM 8 CHARACTERS REQUIRED" });
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      setStatusMsg({ type: "success", text: "ACCOUNT CREATED // REDIRECTING TO WORKSPACE..." });
    }, 1200);
  };

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

        <TechnicalAnnotation label="REGISTRATION" value="CREATE_ACCOUNT" variant="dark" />
      </header>

      {/* Main Content Layout - Perfectly Aligned 50/50 Grid to Match Login */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 border border-[#333333] bg-[#1E1E1E] shadow-2xl overflow-hidden">
          {/* Left Column: Black Stepped Pixel Graphic (50% ratio matching Login) */}
          <div className="lg:col-span-6 bg-[#0A0A0A] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden min-h-[380px] lg:min-h-[540px]">
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg className="w-full h-full text-white" viewBox="0 0 400 400" fill="currentColor">
                <path d="M 0 100 H 300 V 400 H 100 V 300 H 50 V 200 H 0 Z" />
              </svg>
              <div className="absolute bottom-8 right-8 font-mono-tech text-[10px] text-[#A3A3A3]">
                <span>01</span> <span className="ml-4">02</span> <span className="ml-8">03</span>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              <TechnicalAnnotation label="REG 002" value="NEW WORKSPACE" variant="accent" />
              <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight leading-none text-white">
                Create your <br />
                workspace.
              </h1>
              <p className="font-mono-tech text-xs text-[#A3A3A3] leading-relaxed max-w-sm">
                Register your account to initialize your personal collaborative workspace, create documents, and invite team members.
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
                <span className="text-[#F97316]">TLS_WSS // CRDT V1</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sign Up Form Container (50% ratio matching Login) */}
          <div className="lg:col-span-6 p-8 md:p-12 bg-[#1E1E1E] flex flex-col justify-center space-y-6">
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
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label className="block font-mono-tech text-xs uppercase text-[#F5F5F5] tracking-wider">
                  Full Name <span className="text-[#F97316]">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivera"
                  required
                  className="w-full px-4 py-3 bg-[#121212] border border-[#333333] font-mono-tech text-sm text-[#F5F5F5] focus:bg-[#181818] focus:border-[#F97316] focus:outline-none transition-colors"
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block font-mono-tech text-xs uppercase text-[#F5F5F5] tracking-wider">
                  Email Address <span className="text-[#F97316]">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@collabnote.io"
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
                          strength >= step ? (strength >= 3 ? "bg-[#F97316]" : "bg-[#F5F5F5]") : "bg-[#333333]"
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
                  Confirm Password <span className="text-[#F97316]">*</span>
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
              <Link href="/login" className="text-[#F5F5F5] font-bold hover:text-[#F97316] underline">
                [Sign In]
              </Link>
            </div>
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
