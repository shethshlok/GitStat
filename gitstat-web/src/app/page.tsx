"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Github, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Globe, 
  Share2, 
  Layout, 
  Maximize2,
  Zap,
  CheckCircle2,
  Users
} from 'lucide-react';
import { ImpactTicker } from '@/components/ImpactTicker';
import { ShareCard } from '@/components/ShareCard';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('features');

  const shlokStats = {
    totalCommits: 14209,
    linesAdded: 1540200,
    linesDeleted: 840100,
    reposCount: 46,
    branchesCount: 124,
    lastUpdated: new Date().toISOString()
  };

  const shlokActor = {
    login: "shethshlok",
    avatar_url: "https://avatars.githubusercontent.com/u/92412925?v=4"
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-mono selection:bg-green-500/30 overflow-x-hidden">
      {/* 1. ULTRA HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 border-b border-zinc-900">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-green-500/5 via-blue-500/5 to-transparent blur-3xl opacity-50" />
          <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black tracking-widest text-green-500 mb-12 uppercase"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Built for the top 1% of engineers
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-12 uppercase"
            >
              Own Your <br /> <span className="text-green-500">Velocity.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-xl text-zinc-400 mb-16 leading-relaxed font-medium"
            >
              The definitive macOS menu bar utility for high-impact developers. 
              Monitor, visualize, and share your GitHub impact in real-time.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <button className="group relative bg-white text-black px-12 py-6 rounded-2xl font-black text-xl flex items-center gap-3 hover:bg-green-500 transition-all active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <Download className="w-6 h-6" /> DOWNLOAD FOR MACOS
                <div className="absolute -bottom-2 -right-2 bg-green-600 text-[8px] px-2 py-1 rounded-md text-white">V1.0.4 AVAILABLE</div>
              </button>
              <button className="bg-zinc-900 border-2 border-zinc-800 text-white px-12 py-6 rounded-2xl font-black text-xl hover:border-zinc-600 transition-all active:scale-95">
                VIEW SOURCE
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. GLOBAL IMPACT TICKER */}
      <section className="bg-zinc-900/30 border-b border-zinc-900 py-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <ImpactTicker label="TOTAL_LINES_PUSHED" value={1500000000} suffix="+" />
          <ImpactTicker label="GLOBAL_COMMITS" value={240500} suffix="" />
          <ImpactTicker label="ACTIVE_ENGINEERS" value={8200} suffix="" />
        </div>
      </section>

      {/* 3. SHOWCASE: THE "SHLOK" IMPACT CARD */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <Share2 className="text-black w-6 h-6" />
              </div>
              <h2 className="text-6xl font-black tracking-tighter mb-8 uppercase leading-[0.9]">
                Share Your <br /><span className="text-zinc-500 underline decoration-green-500/50">Developer DNA.</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                Generate high-fidelity impact reports with a single click. 
                Designed for social proof, technical clout, and team transparency.
              </p>
              
              <ul className="space-y-6">
                {[
                  "Dynamic Velocity Tracking (24H/7D/30D)",
                  "Brutalist Aesthetics for the Modern Engineer",
                  "Instant High-Resolution PNG Exports",
                  "Direct Social Integration"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-zinc-300 font-bold uppercase text-xs tracking-widest">
                    <CheckCircle2 className="text-green-500 w-5 h-5" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative group">
              <div className="absolute -inset-10 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-[50px] blur-[80px] opacity-50" />
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-[40px] p-4 shadow-2xl overflow-hidden scale-90 md:scale-100">
                <div className="absolute top-4 left-6 flex gap-2 z-50">
                   <div className="w-3 h-3 rounded-full bg-red-500/20" />
                   <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                   <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="mt-8 rounded-[24px] overflow-hidden border border-zinc-800">
                  <ShareCard stats={shlokStats as any} actor={shlokActor as any} />
                </div>
                <div className="mt-6 flex justify-between items-center px-4 pb-2">
                  <span className="text-[10px] text-zinc-600 font-black tracking-widest uppercase">PREVIEW: @SHETHSHLOK_IMPACT</span>
                  <div className="flex gap-2">
                     <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Terminal className="w-4 h-4 text-zinc-500" /></div>
                     <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center"><Layout className="w-4 h-4 text-zinc-500" /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE MENU BAR EXPERIENCE */}
      <section className="py-32 bg-zinc-950 border-y border-zinc-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-black tracking-tighter mb-8 uppercase">The Menu Bar Core</h2>
            <p className="text-zinc-500 max-w-xl mx-auto font-bold uppercase text-xs tracking-[0.3em]">Hardware-Inspired software for the desktop</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <FeatureCard 
              icon={<Zap />} 
              title="ZERO_LATENCY" 
              desc="Direct connection to GitHub Events API with local caching for instant response."
             />
             <FeatureCard 
              icon={<Cpu />} 
              title="LOW_FOOTPRINT" 
              desc="Written in 100% native Swift. Uses <20MB of RAM and zero GPU overhead."
             />
             <FeatureCard 
              icon={<Maximize2 />} 
              title="REPORTS_ENGINE" 
              desc="The same engine that generates your social cards runs locally on your Mac."
             />
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION: PERSONAL STATS */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-500/5 mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-7xl md:text-8xl font-black tracking-tighter mb-12 uppercase">Ready to <br /> ship?</h2>
          <p className="text-2xl text-zinc-400 mb-16 font-medium">Join thousands of engineers who turn their code into visible impact every single day.</p>
          
          <div className="flex flex-col items-center gap-8">
            <button className="bg-white text-black px-16 py-8 rounded-[32px] font-black text-2xl flex items-center gap-4 hover:scale-105 transition-all shadow-2xl">
              GET GITSTAT FOR MACOS <ArrowRight className="w-8 h-8" />
            </button>
            <p className="text-zinc-600 font-black text-[10px] tracking-[0.5em] uppercase">VERIFIED_SECURE // NO_DATA_COLLECTED</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 border-t border-zinc-900 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Github className="text-black w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter">GITSTAT.WEB</span>
          </div>
          
          <div className="flex gap-12 text-[10px] font-black tracking-widest text-zinc-500 uppercase">
             <a href="#" className="hover:text-white transition-colors">Documentation</a>
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Changelog</a>
          </div>

          <div className="text-right">
             <p className="text-[10px] font-black text-zinc-700 tracking-widest uppercase mb-2">Developed by</p>
             <p className="text-lg font-black tracking-tighter uppercase">Shlok Sheth</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-10 rounded-[32px] hover:border-zinc-700 transition-all group">
      <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-green-500 group-hover:text-black transition-all">
        {React.cloneElement(icon, { className: "w-7 h-7" })}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tighter uppercase">{title}</h3>
      <p className="text-zinc-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
