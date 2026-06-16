"use client";

import React from 'react';
import { CommitStats, GitHubActor } from '@/lib/github';
import { Github, Calendar, Activity } from 'lucide-react';

interface ShareCardProps {
  stats: CommitStats;
  actor: GitHubActor;
}

export const ShareCard: React.FC<ShareCardProps> = ({ stats, actor }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const totalLines = stats.linesAdded + stats.linesDeleted;
  const addedPercent = totalLines > 0 ? (stats.linesAdded / totalLines) * 100 : 0;
  const deletedPercent = totalLines > 0 ? (stats.linesDeleted / totalLines) * 100 : 0;

  return (
    <div 
      id="share-card"
      className="w-[1000px] h-[600px] bg-black text-white p-12 relative overflow-hidden flex flex-col font-mono border border-zinc-800"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />
      
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Header */}
      <div className="flex justify-between items-start z-10">
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={actor.avatar_url} 
            alt={actor.login} 
            className="w-20 h-20 rounded-full border-2 border-white/10"
          />
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">{actor.login}</h1>
            <p className="text-zinc-500 text-sm font-bold">github.com/{actor.login}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="inline-block bg-green-500/20 text-green-500 px-3 py-1 rounded text-xs font-black tracking-widest mb-2">
            GITSTAT_REPORT
          </div>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="mt-16 bg-white/[0.03] border border-white/[0.05] rounded-3xl p-10 z-10">
        <p className="text-green-500/80 text-[10px] font-black tracking-[0.2em] mb-8">
          CURRENT_VELOCITY (24H)
        </p>
        
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest mb-2">COMMITS</p>
            <p className="text-7xl font-black tracking-tighter">{stats.totalCommits}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest mb-2">ADDITIONS</p>
            <p className="text-7xl font-black tracking-tighter text-green-500">+{formatNumber(stats.linesAdded)}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-[10px] font-bold tracking-widest mb-2">DELETIONS</p>
            <p className="text-7xl font-black tracking-tighter text-red-500">-{formatNumber(stats.linesDeleted)}</p>
          </div>
        </div>

        {/* Ratio Bar */}
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex gap-0.5">
          <div 
            className="h-full bg-green-500 transition-all duration-1000" 
            style={{ width: `${addedPercent}%` }} 
          />
          <div 
            className="h-full bg-red-500 transition-all duration-1000" 
            style={{ width: `${deletedPercent}%` }} 
          />
        </div>
      </div>

      <div className="mt-auto flex justify-between items-center z-10">
        <div className="flex items-center gap-3 text-white/30">
          <Github className="w-5 h-5" />
          <span className="text-[10px] font-black tracking-[0.2em]">GENERATED_BY_GITSTAT</span>
        </div>
        
        <div className="flex gap-8">
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-zinc-500 tracking-widest">REPOS_TOUCHED</span>
             <span className="text-xl font-black">{stats.reposCount}</span>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-[10px] font-bold text-zinc-500 tracking-widest">BRANCHES_ACTIVE</span>
             <span className="text-xl font-black">{stats.branchesCount}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
