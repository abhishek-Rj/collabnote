"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TechnicalAnnotation } from "../components/TechnicalAnnotation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
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
    if (!email || !password) {
      setStatusMsg({
        type: "error",
        text: "INVALID_INPUT // EMAIL AND PASSWORD REQUIRED",
      });
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);

    // Simulate backend connection
    setTimeout(() => {
      setIsLoading(false);
      setStatusMsg({
        type: "success",
        text: "AUTHENTICATED // REDIRECTING TO WORKSPACE...",
      });
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

        <TechnicalAnnotation
          label="SESSION"
          value="AUTH_LOGIN"
          variant="dark"
        />
      </header>

      {/* Main Content Layout - Perfectly Aligned 50/50 Grid */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 border border-[#333333] bg-[#1E1E1E] shadow-2xl overflow-hidden">
          {/* Left Column: Geometric Graphic & Annotations (50% ratio) */}
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
                Enter your credentials to access your personal workspace, manage your notes, and synchronize changes.
              </p>
            </div>

            {/* Bottom Technical Status */}
            <div className="relative z-10 pt-8 border-t border-[#262626] font-mono-tech text-[10px] text-[#737373] flex items-center justify-between">
              <span>PROTOCOL: TLS_WSS</span>
              <span>REV: 0184</span>
            </div>
          </div>

          {/* Right Column: Form Container (50% ratio) */}
          <div className="lg:col-span-6 p-8 md:p-12 bg-[#1E1E1E] flex flex-col justify-center space-y-6">
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
                {isLoading
                  ? "AUTHENTICATING..."
                  : "SIGN IN TO SESSION →"}
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
        </div>
      </main>

      {/* Footer minimal bar */}
      <footer className="w-full border-t border-[#262626] bg-[#121212] py-3 px-4 md:px-8 text-center font-mono-tech text-[10px] text-[#737373]">
        COLLABNOTE AUTH // SYSTEM READY 0x4F92
      </footer>
    </div>
  );
}
