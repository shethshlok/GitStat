"use client";

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface ImpactTickerProps {
  value: number;
  label: string;
  suffix?: string;
}

export const ImpactTicker: React.FC<ImpactTickerProps> = ({ value, label, suffix = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 20,
    damping: 15
  });

  const display = useTransform(spring, (current) => {
    if (current >= 1000000000) return (current / 1000000000).toFixed(1) + "B";
    if (current >= 1000000) return (current / 1000000).toFixed(1) + "M";
    if (current >= 1000) return (current / 1000).toFixed(1) + "K";
    return Math.floor(current).toLocaleString();
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    return display.on("change", (v) => setDisplayValue(v as any));
  }, [display]);

  return (
    <div className="flex flex-col items-center justify-center p-8 border-r border-zinc-800 last:border-r-0">
      <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 mb-2 uppercase">
        {label}
      </p>
      <div className="text-6xl sm:text-7xl font-black tracking-tighter text-white tabular-nums">
        <motion.span>{displayValue}</motion.span>
        <span className="text-green-500">{suffix}</span>
      </div>
    </div>
  );
};
