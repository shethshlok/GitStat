"use client";

import { motion } from "framer-motion";
import { AnimateIn } from "./AnimateIn";

export function AppPreview() {
  return (
    <section id="preview" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimateIn className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-blue-400 tracking-widest uppercase">Preview</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">
            Designed for your
            <br />
            <span className="text-white/40">menu bar</span>
          </h2>
        </AnimateIn>

        <AnimateIn variant="scale" delay={0.2}>
          <div className="relative max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent overflow-hidden shadow-2xl shadow-black/30"
            >
              {/* Menu bar */}
              <div className="h-8 bg-white/[0.06] border-b border-white/5 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white" opacity="0.6">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <span className="text-xs text-white/40 font-medium">Finder</span>
                  <span className="text-xs text-white/40">File</span>
                  <span className="text-xs text-white/40">Edit</span>
                  <span className="text-xs text-white/40">View</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/40">Wi-Fi</span>
                  <span className="text-xs text-white/40">100%</span>
                  <div className="relative">
                    <motion.div
                      animate={{ boxShadow: ["0 0 0px rgba(34,197,94,0)", "0 0 12px rgba(34,197,94,0.6)", "0 0 0px rgba(34,197,94,0)"] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center border border-green-500/30"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                        <circle cx="12" cy="12" r="3"/>
                        <line x1="12" y1="3" x2="12" y2="6"/>
                        <line x1="12" y1="18" x2="12" y2="21"/>
                      </svg>
                    </motion.div>
                  </div>
                  <span className="text-xs text-white/40">Tue 2:47 PM</span>
                </div>
              </div>

              {/* Desktop */}
              <div className="relative h-[500px] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
                <div className="absolute top-6 left-6 space-y-6">
                  {["Documents", "Projects", "Downloads"].map((name) => (
                    <div key={name} className="flex flex-col items-center gap-1 opacity-30">
                      <div className="w-12 h-12 rounded-lg bg-blue-400/20" />
                      <span className="text-[9px] text-white/60">{name}</span>
                    </div>
                  ))}
                </div>

                {/* Popover */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute top-2 right-20 w-80 glass rounded-xl overflow-hidden shadow-2xl shadow-black/50"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <img src="https://github.com/shethshlok.png" alt="Shlok Sheth" className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <span className="text-xs font-bold font-mono">shloksheth</span>
                        <div className="flex gap-1 mt-0.5">
                          <span className="text-[8px] bg-white/10 px-1 rounded">24H</span>
                          <span className="text-[8px] bg-green-500/20 text-green-400 px-1 rounded">1W</span>
                          <span className="text-[8px] bg-white/10 px-1 rounded">1M</span>
                        </div>
                      </div>
                    </div>
                    <motion.svg
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.3"
                    >
                      <path d="M23 4v6h-6"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"/>
                    </motion.svg>
                  </div>
                  <div className="p-4 space-y-3 font-mono">
                    <div>
                      <div className="text-[8px] text-white/30 font-bold tracking-widest">COMMITS</div>
                      <div className="text-3xl font-black">127</div>
                    </div>
                    <div className="flex gap-3 text-[10px]">
                      <span className="text-green-400 font-bold">+8.2K added</span>
                      <span className="text-red-400 font-bold">-3.1K deleted</span>
                    </div>
                    <div className="flex gap-0.5 h-1 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "72%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="bg-green-400/80"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "28%" }}
                        viewport={{ once: true }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="bg-red-400/80"
                      />
                    </div>
                    <div className="pt-2 border-t border-white/5 space-y-1">
                      {[
                        { dot: "bg-green-400", type: "PUSH", repo: "gitstat", time: "just now" },
                        { dot: "bg-blue-400", type: "PR", repo: "api-v2", time: "5m" },
                        { dot: "bg-purple-400", type: "CREATE", repo: "new-feature", time: "22m" },
                      ].map((e, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.2 + i * 0.1 }}
                          className="flex items-center gap-2 text-[9px]"
                        >
                          <div className={`w-1 h-1 rounded-full ${e.dot}`} />
                          <span className="text-white/50 w-10 font-bold">{e.type}</span>
                          <span className="text-white/30">{e.repo}</span>
                          <span className="ml-auto text-white/20">{e.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-white/[0.01]">
                    <span className="text-[7px] font-mono text-white/20 font-bold">STABLE</span>
                    <div className="flex gap-2">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.3">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16 6 12 2 8 6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                      </svg>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.3">
                        <line x1="4" y1="21" x2="4" y2="14"/>
                        <line x1="4" y1="10" x2="4" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12" y2="3"/>
                        <line x1="20" y1="21" x2="20" y2="16"/>
                        <line x1="20" y1="12" x2="20" y2="3"/>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/30 font-mono">
                <span className="text-green-400">{">"}</span> Click the menu bar icon to see your stats instantly
              </p>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
