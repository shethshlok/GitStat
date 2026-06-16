"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";

function RollingNumber({ targetNumber, prefix = "", suffix = "" }: { targetNumber: number, prefix?: string, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState("0");
  const [isMounted, setIsMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isInView && isMounted) {
      const controls = animate(0, targetNumber, {
        duration: 2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate(value) {
          setDisplayValue(Math.floor(value).toLocaleString("en-US"));
        }
      });
      return () => controls.stop();
    }
  }, [isInView, targetNumber, isMounted]);

  return <span ref={ref}>{prefix}{isMounted ? displayValue : "0"}{suffix}</span>;
}

export function ReportMockup() {
  const [dateStr, setDateStr] = useState("MAY 27, 2026");

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase());
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] text-left w-full max-w-4xl mx-auto shadow-2xl">
      <div className="relative p-6 md:p-12 space-y-8 md:space-y-10">
        {/* Background Gradients & Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-green-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <img src="https://github.com/shethshlok.png" alt="Shlok Sheth" className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 shadow-[0_0_20px_rgba(74,222,128,0.2)] object-cover" />
              <div>
                <div className="font-mono font-black text-white text-xl md:text-2xl tracking-tighter">shloksheth</div>
                <div className="font-mono text-xs text-white/40">github.com/shloksheth</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] md:text-xs font-mono font-black text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded uppercase tracking-widest">GITSTAT_REPORT</div>
              <div className="text-[10px] md:text-xs font-mono text-white/30 mt-2 font-bold tracking-widest">{dateStr}</div>
            </div>
          </div>

          {/* Hero Metric - 24H */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm">
            <div className="text-[10px] md:text-xs font-mono font-black text-green-400/80 tracking-widest mb-6">CURRENT_VELOCITY (24H)</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-0">
              <div>
                <div className="text-[10px] md:text-xs font-mono text-white/40 mb-2 font-bold tracking-widest">COMMITS</div>
                <div className="text-6xl md:text-8xl font-mono font-black text-white leading-none tracking-tighter"><RollingNumber targetNumber={12} /></div>
              </div>
              <div className="flex gap-8 md:gap-16">
                <div>
                  <div className="text-[10px] md:text-xs font-mono text-white/40 mb-2 font-bold tracking-widest">ADDITIONS</div>
                  <div className="text-green-400 font-mono font-black text-2xl md:text-4xl tracking-tighter"><RollingNumber targetNumber={2431} prefix="+" /></div>
                </div>
                <div>
                  <div className="text-[10px] md:text-xs font-mono text-white/40 mb-2 font-bold tracking-widest">DELETIONS</div>
                  <div className="text-red-400 font-mono font-black text-2xl md:text-4xl tracking-tighter"><RollingNumber targetNumber={891} prefix="-" /></div>
                </div>
              </div>
            </div>
            {/* Animated Bar */}
            <div className="flex gap-1 h-2 rounded-full overflow-hidden mt-8 md:mt-10 bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "73%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-green-400 h-full rounded-full" 
              />
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "27%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="bg-red-400 h-full rounded-full" 
              />
            </div>
          </div>

          {/* Trend Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-blue-500/[0.03] border border-blue-500/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <div className="text-[10px] font-mono font-black text-blue-400/80 tracking-widest mb-3">WEEKLY_TOTAL</div>
              <div className="flex items-baseline gap-2 mb-4">
                <div className="text-3xl md:text-4xl font-mono font-black text-white tracking-tighter"><RollingNumber targetNumber={47} /></div>
                <div className="text-[10px] md:text-xs font-mono text-white/40 font-bold">commits</div>
              </div>
              <div className="flex gap-6 text-sm md:text-lg font-mono font-bold tracking-tight">
                <span className="text-green-400"><RollingNumber targetNumber={8241} prefix="+" /></span>
                <span className="text-red-400"><RollingNumber targetNumber={3102} prefix="-" /></span>
              </div>
            </div>
            
            <div className="bg-purple-500/[0.03] border border-purple-500/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
              <div className="text-[10px] font-mono font-black text-purple-400/80 tracking-widest mb-3">MONTHLY_TOTAL</div>
              <div className="flex items-baseline gap-2 mb-4">
                <div className="text-3xl md:text-4xl font-mono font-black text-white tracking-tighter"><RollingNumber targetNumber={183} /></div>
                <div className="text-[10px] md:text-xs font-mono text-white/40 font-bold">commits</div>
              </div>
              <div className="flex gap-6 text-sm md:text-lg font-mono font-bold tracking-tight">
                <span className="text-green-400"><RollingNumber targetNumber={31492} prefix="+" /></span>
                <span className="text-red-400"><RollingNumber targetNumber={12741} prefix="-" /></span>
              </div>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-8 md:mt-10 pt-6 border-t border-white/5 gap-4 md:gap-0">
            <div className="flex items-center gap-3">
              <img src="/menubar-icon.png" alt="" className="w-5 h-5 opacity-40 invert" />
              <span className="text-[10px] font-mono font-black text-white/30 tracking-widest">GENERATED_BY_GITSTAT</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest">INDEXED_PROJECTS: 8</span>
          </div>
        </div>
      </div>
    </div>
  );
}
