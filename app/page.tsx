import React from "react";
import Link from "next/link";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { TechnicalAnnotation } from "./components/TechnicalAnnotation";
import { PixelSteppedHero } from "./components/PixelSteppedHero";
import { InteractiveEditorDemo } from "./components/InteractiveEditorDemo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212] text-[#F5F5F5] selection:bg-[#F97316] selection:text-white">
      {/* Top Minimal Navigation */}
      <Header />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-8 sm:pt-12 md:pt-16 pb-16 sm:pb-20 border-b border-[#262626]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Clean Responsive Top Annotation Tag */}
            <div className="flex items-center mb-6 sm:mb-8">
              <TechnicalAnnotation
                label="COLLABNOTE"
                value="CO-AUTHOR ENGINE"
                variant="accent"
              />
            </div>

            {/* Asymmetric Editorial Hero Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
              <div className="lg:col-span-8 space-y-6">
                <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-[#F5F5F5] leading-[0.9] uppercase">
                  Write <br />
                  together. <br />
                  <span className="text-[#F97316]">In sync.</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-[#A3A3A3] font-normal max-w-2xl leading-relaxed">
                  One note. Everyone’s cursor. An editorial collaborative editor built with deterministic state vector sync, zero handoff friction, and a quiet, brutalist UI.
                </p>

                {/* Primary Actions */}
                <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
                  <Link
                    href="/signup"
                    className="font-mono-tech text-xs sm:text-sm uppercase px-6 sm:px-8 py-3.5 sm:py-4 bg-[#F5F5F5] text-[#121212] font-semibold hover:bg-[#F97316] hover:text-white transition-colors border border-[#F5F5F5] hover:border-[#F97316] tracking-wider shadow-md"
                  >
                    Start Writing [NOW] →
                  </Link>

                  <Link
                    href="/login"
                    className="font-mono-tech text-xs sm:text-sm uppercase px-6 sm:px-8 py-3.5 sm:py-4 bg-[#1E1E1E] text-[#F5F5F5] hover:bg-[#262626] transition-colors border border-[#333333] tracking-wider"
                  >
                    Login to Session
                  </Link>
                </div>
              </div>

              {/* Right Column Editorial Technical Annotations */}
              <div className="lg:col-span-4 space-y-6 border-l border-[#262626] lg:pl-8 pt-4 lg:pt-0">
                <div className="space-y-2">
                  <div className="font-mono-tech text-xs uppercase tracking-widest text-[#F97316]">
                    01 // PHILOSOPHY
                  </div>
                  <p className="font-mono-tech text-xs text-[#A3A3A3] leading-relaxed">
                    Designed for teams who refuse to trade editorial rigor for collaborative chaos. No floating bubbles, no generic templates.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-[#262626]">
                  <div className="font-mono-tech text-xs uppercase tracking-widest text-[#F97316]">
                    02 // ARCHITECTURE
                  </div>
                  <p className="font-mono-tech text-xs text-[#A3A3A3] leading-relaxed">
                    Powered by Conflict-free Replicated Data Types (CRDT). State vector sync resolves edits concurrently without server lockouts.
                  </p>
                </div>
              </div>
            </div>

            {/* Stepped Pixel Hero Composition Component */}
            <div className="w-full border border-[#333333] bg-[#121212] shadow-2xl overflow-hidden">
              <PixelSteppedHero />
            </div>
          </div>
        </section>

        {/* Live Interactive Product Preview Section */}
        <section id="demo" className="py-16 sm:py-20 border-b border-[#262626] bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <TechnicalAnnotation
                  label="LIVE ENGINE DEMO"
                  value="REAL-TIME"
                  variant="accent"
                />
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-[#F5F5F5] mt-2">
                  Experience real-time presence.
                </h2>
              </div>
              <p className="font-mono-tech text-xs text-[#A3A3A3] max-w-md">
                Live document state synchronization with low latency, word counters, and active collaborator presence.
              </p>
            </div>

            {/* Interactive Editor Demo */}
            <InteractiveEditorDemo />
          </div>
        </section>

        {/* Asymmetric Features & Editorial Grid */}
        <section id="features" className="py-16 sm:py-20 border-b border-[#262626] bg-[#121212]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-12">
              <TechnicalAnnotation
                label="CAPABILITIES"
                value="SYSTEM MATRIX"
                variant="dark"
              />
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight uppercase text-[#F5F5F5] mt-2">
                Built for speed & clarity.
              </h2>
            </div>

            {/* Editorial Asymmetric Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 border border-[#333333] divide-y md:divide-y-0 md:divide-x divide-[#333333] bg-[#1E1E1E]">
              {/* Feature 01 */}
              <div className="p-6 sm:p-8 space-y-4 hover:bg-[#262626] transition-colors">
                <div className="font-mono-tech text-xs text-[#F97316] tracking-widest uppercase">
                  [ 01 ] // CONCURRENCY
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] uppercase tracking-tight">
                  Zero Lockouts
                </h3>
                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                  Multiple writers edit the exact same paragraph simultaneously. CRDT algorithms guarantee convergence without overwriting keystrokes.
                </p>
                <div className="pt-4 border-t border-[#333333] font-mono-tech text-[10px] text-[#737373]">
                  SYNC_LATENCY: 2.4ms // ALGORITHM: YJS-CRDT
                </div>
              </div>

              {/* Feature 02 */}
              <div className="p-6 sm:p-8 space-y-4 hover:bg-[#262626] transition-colors">
                <div className="font-mono-tech text-xs text-[#F97316] tracking-widest uppercase">
                  [ 02 ] // TYPOGRAPHY
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] uppercase tracking-tight">
                  Editorial Rigor
                </h3>
                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                  Designed for deep writing focus. Precise line lengths, comfortable vertical rhythm, crisp monochromes, and zero UI clutter.
                </p>
                <div className="pt-4 border-t border-[#333333] font-mono-tech text-[10px] text-[#737373]">
                  TYPEFACE: GOOGLE SANS // RHYTHM: 1.6
                </div>
              </div>

              {/* Feature 03 */}
              <div className="p-6 sm:p-8 space-y-4 hover:bg-[#262626] transition-colors">
                <div className="font-mono-tech text-xs text-[#F97316] tracking-widest uppercase">
                  [ 03 ] // RESILIENCE
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] uppercase tracking-tight">
                  Offline Continuity
                </h3>
                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                  Write offline seamlessly. Local delta changes buffer locally in IndexedDB and reconcile automatically upon reconnect.
                </p>
                <div className="pt-4 border-t border-[#333333] font-mono-tech text-[10px] text-[#737373]">
                  STORAGE: INDEXED_DB // QUEUE: OFF_RECONNECT
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Engine Specs Section */}
        <section id="specs" className="py-16 sm:py-20 border-b border-[#262626] bg-[#0A0A0A] text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <TechnicalAnnotation
                  label="TECHNICAL SPECS"
                  value="V1.4.2"
                  variant="accent"
                />
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight leading-tight">
                  Uncompromising Performance.
                </h2>
                <p className="text-xs sm:text-sm text-[#A3A3A3] leading-relaxed">
                  CollabNote operates at the boundary of web sockets and binary state vectors. Microsecond latency ensures fluid co-authoring across continents.
                </p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-tech text-xs">
                <div className="border border-[#262626] p-5 sm:p-6 bg-[#171717] space-y-2">
                  <span className="text-[#A3A3A3] uppercase">STATE CONVERGENCE</span>
                  <div className="text-2xl sm:text-3xl font-bold text-[#F97316]">100%</div>
                  <p className="text-[10px] text-[#737373]">Mathematical deterministic final consistency.</p>
                </div>

                <div className="border border-[#262626] p-5 sm:p-6 bg-[#171717] space-y-2">
                  <span className="text-[#A3A3A3] uppercase">PEER LATENCY</span>
                  <div className="text-2xl sm:text-3xl font-bold text-white">&lt; 4ms</div>
                  <p className="text-[10px] text-[#737373]">Direct binary stream serialization.</p>
                </div>

                <div className="border border-[#262626] p-5 sm:p-6 bg-[#171717] space-y-2">
                  <span className="text-[#A3A3A3] uppercase">ENCRYPTION</span>
                  <div className="text-2xl sm:text-3xl font-bold text-white">AES-256</div>
                  <p className="text-[10px] text-[#737373]">End-to-end socket TLS protocol.</p>
                </div>

                <div className="border border-[#262626] p-5 sm:p-6 bg-[#171717] space-y-2">
                  <span className="text-[#A3A3A3] uppercase">MEMORY FOOTPRINT</span>
                  <div className="text-2xl sm:text-3xl font-bold text-[#F97316]">&lt; 12MB</div>
                  <p className="text-[10px] text-[#737373]">Zero runtime bloat or garbage spikes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Block */}
        <section className="py-20 sm:py-24 bg-[#121212] text-[#F5F5F5]">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6 sm:space-y-8">
            <TechnicalAnnotation
              label="GET STARTED"
              value="ACCESSIBLE NOW"
              variant="dark"
            />
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight">
              Ready to write without handoffs?
            </h2>
            <p className="font-mono-tech text-xs sm:text-sm text-[#A3A3A3] max-w-xl mx-auto">
              Create an account or login to access your collaborative notes workspace immediately.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link
                href="/signup"
                className="font-mono-tech text-xs sm:text-sm uppercase px-8 sm:px-10 py-4 sm:py-5 bg-[#F5F5F5] text-[#121212] font-bold hover:bg-[#F97316] hover:text-white transition-colors border border-[#F5F5F5] hover:border-[#F97316] tracking-wider shadow-lg"
              >
                Create Account
              </Link>
              <Link
                href="/login"
                className="font-mono-tech text-xs sm:text-sm uppercase px-8 sm:px-10 py-4 sm:py-5 bg-[#1E1E1E] text-[#F5F5F5] hover:bg-[#262626] transition-colors border border-[#333333] tracking-wider"
              >
                Login to Session
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Architectural Dark Footer */}
      <Footer />
    </div>
  );
}
