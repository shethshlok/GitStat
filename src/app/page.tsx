"use client";

import { motion, useInView, animate, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { ReportMockup } from "../components/ReportMockup";

// --- Components ---

function RollingNumber({ targetNumber }: { targetNumber: number }) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, targetNumber, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(value) {
          setDisplayValue(Math.floor(value).toLocaleString("en-US"));
        }
      });
      return () => controls.stop();
    }
  }, [isInView, targetNumber]);

  return <span ref={ref}>{displayValue}</span>;
}

function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const dx = useSpring(x, springConfig);
  const dy = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: dx, y: dy }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

function RevealText({ text, className }: { text: string; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.div>
    </div>
  );
}

// --- Main Page ---

export default function Home() {
  const [time, setTime] = useState("");
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Parallax effects
  const heroTextY = useTransform(smoothProgress, [0, 0.2], [0, -100]);
  const imageY = useTransform(smoothProgress, [0, 0.5], [0, -150]);
  const imageScale = useTransform(smoothProgress, [0, 0.3], [1, 1.05]);
  const opacityFade = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    // Track event in Microsoft Clarity
    if (typeof window !== "undefined" && (window as any).clarity) {
      (window as any).clarity("event", "download_dmg");
    }
    
    const link = document.createElement('a');
    link.href = '/GitStat.dmg';
    link.download = 'GitStat.dmg';
    link.click();
  };

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#020408] text-[#e2e8f0] overflow-x-hidden selection:bg-blue-600">
      <div className="noise-overlay opacity-20" />
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-green-600/10 rounded-full blur-[160px] animate-pulse" />
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] p-6 md:px-12 flex justify-between items-center mix-blend-difference"
      >
        <div className="flex items-center gap-4">
          <img src="/menubar-icon.png" alt="GitStat" className="w-5 h-5 invert" />
          <div className="font-mono text-xs tracking-[0.4em] font-bold uppercase">
            GitStat
          </div>
        </div>
        <div className="font-mono text-xs tracking-[0.2em] text-blue-400">
          {time || "00:00:00"}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6">
        <motion.div 
          style={{ y: heroTextY, opacity: opacityFade }}
          className="text-center z-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="inline-block mb-8 px-5 py-1.5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-[0.3em] bg-white/5 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <img src="/menubar-icon.png" alt="" className="w-3 h-3 invert opacity-70" />
              <span>Engineering Intelligence System</span>
            </div>
          </motion.div>

          <div className="relative">
            <h1 className="font-chakra text-[10vw] md:text-[12vw] font-bold uppercase tracking-tighter leading-[0.8] mb-4">
              <RevealText text="CODE LOUD." />
              <RevealText text="SHIP LEGEND." className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400" />
            </h1>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-space text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            GitStat turns your raw git history into high-definition impact reports. 
            Because your velocity deserves to be seen, not just stored.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <MagneticButton 
              onClick={handleDownload}
              className="px-12 py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-sm rounded-full transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              Download Now
            </MagneticButton>
            <MagneticButton className="px-12 py-5 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-sm rounded-full hover:bg-white/5 transition-colors">
              GitHub Repo
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Hero Image Showcase */}
        <motion.div 
          style={{ y: imageY, scale: imageScale }}
          className="mt-20 w-full max-w-7xl px-4 perspective-[2000px]"
        >
          <motion.div 
            initial={{ opacity: 0, rotateX: 20, y: 100 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full flex justify-center drop-shadow-2xl"
          >
            <ReportMockup />
          </motion.div>
        </motion.div>
      </section>

      {/* Numbers Section */}
      <section className="relative py-40 px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto text-center relative z-10"
        >
          <div className="mb-20">
            <motion.h2 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="font-chakra text-6xl md:text-[12vw] font-bold leading-none tracking-tighter uppercase mb-6"
            >
              <RollingNumber targetNumber={1458920193} />
            </motion.h2>
            <p className="font-mono text-xl md:text-3xl text-slate-500 uppercase tracking-[0.3em]">
              Lines of Code Tracked Globally
            </p>
          </div>

          <p className="font-space text-2xl md:text-4xl text-slate-300 max-w-5xl mx-auto leading-tight uppercase font-medium">
            Don't let your contributions get lost in the noise. 
            <span className="text-white"> Quantify your impact</span> for the people who matter.
          </p>
        </motion.div>
        
        {/* Background Text Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-chakra text-[40vw] font-black text-white/[0.02] select-none pointer-events-none uppercase">
          IMPACT
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-40 px-6 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="font-chakra text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none">
              Built for<br/>High-Performers.
            </h2>
            <p className="font-mono text-xs text-slate-500 uppercase tracking-[0.5em] mb-4">
              Feature Specification // 01-03
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-white/10 border border-white/10 rounded-[2rem] overflow-hidden">
            {[
              { title: "ALWAYS VISIBLE", desc: "Minimal menubar presence. High-fidelity stats, always one click away.", icon: <img src="/menubar-icon.png" className="w-10 h-10 invert" /> },
              { title: "BRUTALIST DESIGN", desc: "Aesthetic reports designed for the modern developer's social presence.", icon: "02" },
              { title: "ZERO FRICTION", desc: "No complex setup. Just your raw additions, deletions, and commits.", icon: "03" }
            ].map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className="bg-white/[0.05] p-12 md:p-16 hover:bg-white/[0.08] transition-colors group"
              >
                <div className="font-mono text-4xl text-blue-500 mb-12 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="font-chakra text-3xl font-bold uppercase mb-6 tracking-tight">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed text-lg">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DMG Installation Guide */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="font-chakra text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4">
              Seamless Installation.
            </h2>
            <p className="font-space text-lg text-slate-400">
              Drag GitStat into your Applications folder to begin tracking.
            </p>
          </div>

          <div className="relative bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 md:p-20 backdrop-blur-xl overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }} />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
              {/* App Icon */}
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-[2.5rem] p-6 flex items-center justify-center border border-white/10 shadow-2xl relative group">
                  <div className="absolute inset-0 bg-blue-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <img src="/menubar-icon.png" alt="GitStat App" className="w-20 h-20 invert relative z-10" />
                </div>
                <span className="font-mono text-xs text-white/40 tracking-[0.2em] font-bold uppercase">GitStat.app</span>
              </motion.div>

              {/* Animated Arrow */}
              <div className="flex-1 flex items-center justify-center py-8 md:py-0">
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="relative w-full max-w-[200px]"
                >
                  <svg viewBox="0 0 200 40" fill="none" className="w-full">
                    <motion.path 
                      d="M10 20H190" 
                      stroke="url(#arrowGradient)" 
                      strokeWidth="3" 
                      strokeDasharray="10 10"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    <path d="M180 10L195 20L180 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
                        <stop offset="50%" stopColor="rgba(59, 130, 246, 1)" />
                        <stop offset="100%" stopColor="rgba(34, 197, 94, 1)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-8">
                    <span className="font-mono text-[10px] text-blue-400 font-black tracking-[0.4em] whitespace-nowrap uppercase animate-pulse">
                      Drag to install
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Applications Folder */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl relative">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="opacity-40">
                    <path d="M22 19V9C22 7.89543 21.1046 7 20 7H12L10 4H4C2.89543 4 2 4.89543 2 6V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19Z" />
                    <path d="M12 11L12 17" strokeLinecap="round" />
                    <path d="M9 14L15 14" strokeLinecap="round" />
                  </svg>
                  <div className="absolute top-2 right-4">
                    <div className="text-[8px] font-mono font-black text-white/20 tracking-widest uppercase">system_folder</div>
                  </div>
                </div>
                <span className="font-mono text-xs text-white/40 tracking-[0.2em] font-bold uppercase">Applications</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-60 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto"
        >
          <h2 className="font-chakra text-[8vw] font-bold uppercase leading-none mb-12 tracking-tighter">
            Elevate Your<br/>Engineering Story.
          </h2>
          <MagneticButton 
            onClick={handleDownload}
            className="px-16 py-7 bg-white text-black font-black uppercase tracking-[0.3em] text-lg rounded-full shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-transform"
          >
            Get GitStat Now
          </MagneticButton>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#010204]">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500 uppercase tracking-[0.5em]">
            <img src="/menubar-icon.png" alt="" className="w-3 h-3 opacity-50 invert" />
            GitStat // The Architecture of Progress
          </div>
          <div className="flex gap-12 font-mono text-[10px] text-slate-500 uppercase tracking-[0.5em]">
            <a href="#" className="hover:text-white transition-colors">Twitter / X</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
          <div className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.5em]">
            By <a href="https://shloksheth.tech" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Shlok Sheth</a> // © 2026
          </div>
        </div>
      </footer>
    </main>
  );
}
