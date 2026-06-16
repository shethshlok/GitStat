"use client";

import { motion } from "framer-motion";
import { AnimateIn, StaggerContainer, StaggerItem } from "./AnimateIn";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18"/>
        <path d="M9 21V9"/>
      </svg>
    ),
    title: "Menu Bar Native",
    description: "Lives in your macOS menu bar. One click to see your stats — no app windows stealing focus.",
    color: "green",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Real-Time Velocity",
    description: "Commits, additions, deletions — tracked across 24h, weekly, and monthly windows with live auto-refresh.",
    color: "blue",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    title: "Activity Log",
    description: "See your recent pushes, PRs, issues, and branch activity in a clean, filterable feed.",
    color: "purple",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: "Trend Analytics",
    description: "Interactive charts for commits, additions, and deletions. See your productivity patterns over time.",
    color: "orange",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
    ),
    title: "Export & Share",
    description: "Generate beautiful stat cards as PNG images. Share your coding velocity on Twitter, LinkedIn, or your README.",
    color: "pink",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Secure OAuth",
    description: "Authenticate via GitHub OAuth with tokens stored securely in macOS Keychain. No passwords stored.",
    color: "cyan",
  },
];

const colorMap: Record<string, { bg: string; text: string; glow: string; hover: string }> = {
  green: { bg: "bg-green-500/10", text: "text-green-400", glow: "hover:shadow-green-500/10", hover: "hover:border-green-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", glow: "hover:shadow-blue-500/10", hover: "hover:border-blue-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", glow: "hover:shadow-purple-500/10", hover: "hover:border-purple-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", glow: "hover:shadow-orange-500/10", hover: "hover:border-orange-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", glow: "hover:shadow-pink-500/10", hover: "hover:border-pink-500/20" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "hover:shadow-cyan-500/10", hover: "hover:border-cyan-500/20" },
};

export function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimateIn className="text-center mb-16">
          <span className="text-xs font-mono font-bold text-green-400 tracking-widest uppercase">Features</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">
            Everything you need,
            <br />
            <span className="text-white/40">nothing you don&apos;t</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-lg mx-auto">
            Built for developers who want to stay in flow. Lightweight, fast, and designed to live in your menu bar.
          </p>
        </AnimateIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.08}>
          {features.map((f, i) => {
            const c = colorMap[f.color];
            return (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                  className={`group relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ${c.hover} hover:shadow-2xl ${c.glow} cursor-default`}
                >
                  <motion.div
                    whileHover={{ rotate: 8, scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-4`}
                  >
                    {f.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.description}</p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
