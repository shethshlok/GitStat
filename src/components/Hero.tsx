"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/8 rounded-full blur-[150px]" />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
        >
          <motion.span
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 rounded-full bg-green-400"
          />
          <span className="text-xs font-mono text-white/70">macOS Menu Bar App</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]"
        >
          Your GitHub Pulse,
          <br />
          <span className="text-gradient">Always Visible</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="max-w-2xl mx-auto mt-6 text-lg sm:text-xl text-white/50 leading-relaxed"
        >
          Track commits, lines added & deleted right from your Mac menu bar.
          No browser, no context switching — just your coding velocity, always one glance away.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <motion.a
            href="#download"
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(34,197,94,0.3)" }}
            whileTap={{ scale: 0.97 }}
            className="group flex items-center gap-3 bg-green-500 hover:bg-green-400 text-black font-bold text-base px-8 py-4 rounded-xl transition-colors glow-green"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download for Mac — Free
            <motion.svg
              width="16" height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </motion.svg>
          </motion.a>
          <motion.a
            href="#preview"
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-white/60 hover:text-white font-medium text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            See it in action
          </motion.a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-14 flex flex-col items-center gap-3"
        >
          <div className="flex -space-x-2">
            {[
              "bg-gradient-to-br from-blue-400 to-blue-600",
              "bg-gradient-to-br from-purple-400 to-purple-600",
              "bg-gradient-to-br from-orange-400 to-orange-600",
              "bg-gradient-to-br from-pink-400 to-pink-600",
              "bg-gradient-to-br from-green-400 to-green-600",
            ].map((bg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 300 }}
                className={`w-8 h-8 rounded-full ${bg} border-2 border-[#0a0a0a] flex items-center justify-center`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white" opacity="0.8">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </motion.div>
            ))}
          </div>
          <p className="text-xs font-mono text-white/40">
            Loved by <span className="text-green-400 font-bold">500+</span> developers tracking their coding velocity
          </p>
        </motion.div>

        {/* Floating terminal mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <div className="mx-auto max-w-md glass rounded-2xl overflow-hidden glow-green">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" />
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-yellow-500/80 cursor-pointer" />
                <motion.div whileHover={{ scale: 1.3 }} className="w-3 h-3 rounded-full bg-green-500/80 cursor-pointer" />
                <span className="ml-2 text-[10px] font-mono text-white/30">GitStat — Menu Bar</span>
              </div>
              <div className="p-6 font-mono text-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500" />
                    <div>
                      <div className="font-bold text-white text-xs">shloksheth</div>
                      <div className="text-[10px] text-white/40 flex gap-2 mt-0.5">
                        <span className="bg-white/5 px-1.5 py-0.5 rounded text-[9px]">24H</span>
                        <span className="bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded text-[9px]">1W</span>
                        <span className="bg-white/5 px-1.5 py-0.5 rounded text-[9px]">1M</span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.3">
                      <path d="M23 4v6h-6M1 20v-6h6"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                  </motion.div>
                </div>

                <div>
                  <div className="text-[9px] text-white/30 font-bold tracking-widest">COMMITS</div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                    className="text-4xl font-black text-white"
                  >
                    47
                  </motion.div>
                </div>

                <div className="flex gap-4">
                  {[
                    { label: "ADD", value: "+2.4K", color: "green" },
                    { label: "DEL", value: "-891", color: "red" },
                    { label: "NET", value: "+1.5K", color: "blue" },
                  ].map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <span className={`text-[8px] font-bold text-${m.color}-400 bg-${m.color}-400/10 px-1.5 py-0.5 rounded`}>{m.label}</span>
                      <span className={`text-${m.color}-400 font-bold text-xs`}>{m.value}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "72%" }}
                    transition={{ delay: 1.5, duration: 1, ease: "easeOut" }}
                    className="bg-green-400/80 rounded-full"
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "28%" }}
                    transition={{ delay: 1.7, duration: 0.8, ease: "easeOut" }}
                    className="bg-red-400/80 rounded-full"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="text-[9px] text-white/30 font-bold tracking-widest">ACTIVITY_LOG</div>
                  {[
                    { type: "PUSH", repo: "gitstat", time: "2m ago", color: "bg-green-400" },
                    { type: "PR", repo: "api-gateway", time: "14m ago", color: "bg-blue-400" },
                    { type: "ISSUE", repo: "docs", time: "1h ago", color: "bg-orange-400" },
                  ].map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.8 + i * 0.15 }}
                      className="flex items-center gap-3 text-[10px]"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                        className={`w-1.5 h-1.5 rounded-full ${e.color}`}
                      />
                      <span className="text-white/60 font-bold w-10">{e.type}</span>
                      <span className="text-white/40">{e.repo}</span>
                      <span className="ml-auto text-white/20">{e.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
