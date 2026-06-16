"use client";

import { motion } from "framer-motion";
import { AnimateIn } from "./AnimateIn";

export function ShareSection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <AnimateIn variant="fadeLeft">
            <div>
              <span className="text-xs font-mono font-bold text-pink-400 tracking-widest uppercase">Share</span>
              <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Show off your
                <br />
                <span className="text-gradient">coding velocity</span>
              </h2>
              <p className="mt-4 text-white/40 leading-relaxed max-w-md">
                Export beautiful stat cards as high-res PNGs. Share your daily, weekly, or monthly coding activity on Twitter, LinkedIn, or embed in your GitHub README.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  {
                    name: "Twitter / X",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    ),
                  },
                  {
                    name: "LinkedIn",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    ),
                  },
                  {
                    name: "GitHub",
                    icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    ),
                  },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white/60 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                  >
                    {s.icon}
                    <span className="text-sm font-medium">{s.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimateIn>

          <AnimateIn variant="fadeRight" delay={0.2}>
            <div className="relative">
              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl blur-3xl"
              />
              <motion.div
                whileHover={{ scale: 1.02, rotate: 0.5 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-black"
              >
                <div className="relative p-10 space-y-8">
                  <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "50px 50px",
                  }} />
                  <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/10 rounded-full blur-[60px]" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <img src="https://github.com/shethshlok.png" alt="Shlok Sheth" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="font-mono font-black text-white text-sm">shloksheth</div>
                          <div className="font-mono text-[10px] text-white/30">github.com/shloksheth</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] font-mono font-black text-green-400 bg-green-400/10 px-2 py-1 rounded">GITSTAT_REPORT</div>
                        <div className="text-[9px] font-mono text-white/30 mt-1">MAY 27, 2026</div>
                      </div>
                    </div>

                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6 mb-6">
                      <div className="text-[9px] font-mono font-black text-green-400/80 tracking-widest mb-3">CURRENT_VELOCITY (24H)</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-[9px] font-mono text-white/30">COMMITS</div>
                          <div className="text-5xl font-mono font-black text-white">12</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-mono font-bold text-lg">+2,431</div>
                          <div className="text-red-400 font-mono font-bold text-lg">-891</div>
                        </div>
                      </div>
                      <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden mt-4">
                        <div className="bg-green-400 w-[73%] rounded-full" />
                        <div className="bg-red-400 w-[27%] rounded-full" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4">
                        <div className="text-[8px] font-mono font-black text-blue-400/80 tracking-widest">WEEKLY_TOTAL</div>
                        <div className="text-2xl font-mono font-bold text-white mt-1">47</div>
                        <div className="flex gap-2 mt-1 text-[10px] font-mono font-bold">
                          <span className="text-green-400">+8.2K</span>
                          <span className="text-red-400">-3.1K</span>
                        </div>
                      </div>
                      <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-4">
                        <div className="text-[8px] font-mono font-black text-purple-400/80 tracking-widest">MONTHLY_TOTAL</div>
                        <div className="text-2xl font-mono font-bold text-white mt-1">183</div>
                        <div className="flex gap-2 mt-1 text-[10px] font-mono font-bold">
                          <span className="text-green-400">+31.4K</span>
                          <span className="text-red-400">-12.7K</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500/20 flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </div>
                        <span className="text-[8px] font-mono font-black text-white/20">GENERATED_BY_GITSTAT</span>
                      </div>
                      <span className="text-[8px] font-mono text-white/20">INDEXED_PROJECTS: 8</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
