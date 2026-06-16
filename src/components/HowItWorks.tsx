"use client";

import { motion } from "framer-motion";
import { AnimateIn } from "./AnimateIn";

const steps = [
  {
    number: "01",
    title: "Install & Authenticate",
    description: "Download GitStat, drop it in Applications, and click \"Login with GitHub\" to securely connect via OAuth.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    color: "from-green-500/20 to-green-500/5",
  },
  {
    number: "02",
    title: "Glance at Your Menu Bar",
    description: "Your coding stats live in the macOS menu bar. One click opens the full dashboard with commits, lines, and activity.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    number: "03",
    title: "Track & Share",
    description: "Watch your velocity over time with built-in analytics. Export beautiful stat cards to share on social media.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13"/>
        <path d="M22 2L15 22l-4-9-9-4z"/>
      </svg>
    ),
    color: "from-purple-500/20 to-purple-500/5",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimateIn className="text-center mb-20">
          <span className="text-xs font-mono font-bold text-orange-400 tracking-widest uppercase">How It Works</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight">
            Three steps to
            <br />
            <span className="text-white/40">coding clarity</span>
          </h2>
        </AnimateIn>

        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute left-8 top-0 w-px bg-gradient-to-b from-green-500/50 via-blue-500/50 to-purple-500/50 hidden md:block"
          />

          <div className="space-y-16">
            {steps.map((step, i) => (
              <AnimateIn key={i} variant="fadeUp" delay={i * 0.2}>
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex gap-8 items-start"
                >
                  <div className="relative flex-shrink-0">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} border border-white/10 flex items-center justify-center text-white/60`}
                    >
                      {step.icon}
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.2, type: "spring", stiffness: 400 }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <span className="text-[10px] font-mono font-black text-black">{step.number}</span>
                    </motion.div>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-white/40 leading-relaxed max-w-md">{step.description}</p>
                  </div>
                </motion.div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
