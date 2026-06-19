"use client";

import { motion } from "framer-motion";
import { AnimateIn } from "./AnimateIn";

export function Download() {
  return (
    <section id="download" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.15, 0.05] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-green-500 rounded-full blur-[120px] pointer-events-none"
        />

        <div className="relative">
          <AnimateIn>
            <span className="text-xs font-mono font-bold text-green-400 tracking-widest uppercase">Download</span>
            <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
              Ready to track your
              <br />
              <span className="text-gradient">coding pulse?</span>
            </h2>
            <p className="mt-4 text-white/40 max-w-lg mx-auto text-lg">
              Free, lightweight, and built for developers who value their time. Works on macOS 12 (Monterey) and later.
            </p>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href="/GitStat.dmg"
                download="GitStat.dmg"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 bg-white text-black font-bold text-lg px-10 py-5 rounded-2xl shadow-2xl shadow-white/10"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Download for macOS
                <motion.svg
                  width="20" height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  animate={{ y: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                </motion.svg>
              </motion.a>
            </div>
          </AnimateIn>

          <AnimateIn delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
              {[
                "macOS 12+",
                "Apple Silicon & Intel",
                "Free & Open Source",
                "No dependencies",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  {item}
                </motion.div>
              ))}
            </div>
          </AnimateIn>

          {/* Mac lineup */}
          <AnimateIn variant="fadeUp" delay={0.3}>
            <div className="mt-20 flex items-end justify-center gap-6">
              {/* MacBook */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="w-64 h-40 rounded-t-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden">
                  <div className="h-5 bg-white/[0.06] border-b border-white/5 flex items-center px-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-center h-[calc(100%-20px)]">
                    <div className="text-center">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="text-2xl font-mono font-black text-green-400"
                      >
                        47
                      </motion.div>
                      <div className="text-[7px] font-mono text-white/30 mt-0.5">COMMITS TODAY</div>
                      <div className="flex gap-2 justify-center mt-1 text-[7px] font-mono">
                        <span className="text-green-400/70">+2.4K</span>
                        <span className="text-red-400/70">-891</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-72 h-3 bg-white/[0.04] border border-white/10 border-t-0 rounded-b-lg mx-auto -mt-px" />
                <p className="text-[10px] font-mono text-white/20 text-center mt-3">MacBook Pro / Air</p>
              </motion.div>

              {/* iMac */}
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative hidden md:block"
              >
                <div className="w-48 h-56 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden">
                  <div className="h-5 bg-white/[0.06] border-b border-white/5 flex items-center px-2">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center h-[calc(100%-20px)] gap-2">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="3"/>
                        <line x1="12" y1="3" x2="12" y2="6"/>
                        <line x1="12" y1="18" x2="12" y2="21"/>
                      </svg>
                    </motion.div>
                    <div className="text-lg font-mono font-black">GitStat</div>
                    <div className="text-[8px] font-mono text-white/30">Your GitHub Pulse</div>
                  </div>
                </div>
                <div className="w-16 h-10 bg-white/[0.03] border border-white/10 border-t-0 mx-auto rounded-b" />
                <p className="text-[10px] font-mono text-white/20 text-center mt-3">iMac / Mac Studio</p>
              </motion.div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
