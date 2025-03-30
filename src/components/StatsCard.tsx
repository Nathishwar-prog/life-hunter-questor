
import React from 'react';
import { Dumbbell, Zap, Brain, Heart, MessageSquare, TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface StatProps {
  name: string;
  value: number;
  max: number;
  icon: React.ReactNode;
  color: string;
  recentChange?: number;
}

const Stat: React.FC<StatProps> = ({ name, value, max, icon, color, recentChange = 0 }) => {
  const percentage = (value / max) * 100;
  
  return (
    <div className="flex flex-col">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full`} style={{ backgroundColor: color }}>
            {icon}
          </span>
          <span className="text-sm font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold">{value}/{max}</span>
          {recentChange !== 0 && (
            <span className={`stat-badge ${recentChange > 0 ? 'stat-increase' : 'stat-decrease'}`}>
              {recentChange > 0 ? '+' : ''}{recentChange}
            </span>
          )}
        </div>
      </div>
      <Progress value={percentage} className="h-2" 
        style={{ 
          background: `${color}30`,
          '--progress-foreground': color
        } as React.CSSProperties} 
      />
    </div>
  );
};

interface StatsCardProps {
  stats: {
    strength: number;
    agility: number;
    intelligence: number;
    vitality: number;
    charisma: number;
  };
  level: number;
  exp: number;
  expToNextLevel: number;
  recentChanges?: {
    strength?: number;
    agility?: number;
    intelligence?: number;
    vitality?: number;
    charisma?: number;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ stats, level, exp, expToNextLevel, recentChanges = {} }) => {
  return (
    <div className="quest-card overflow-hidden">
      <div className="relative mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Hunter Stats</h3>
        <div className="flex items-center gap-2">
          <span className="hunter-badge h-8 w-8">
            <span className="text-xs font-bold">{level}</span>
          </span>
          <div>
            <div className="text-xs text-white/60">Hunter Level</div>
            <div className="text-xs text-white/60">{exp}/{expToNextLevel} EXP</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Stat
          name="Strength"
          value={stats.strength}
          max={100}
          icon={<Dumbbell className="h-3.5 w-3.5 text-white" />}
          color="#FF5757"
          recentChange={recentChanges.strength}
        />
        <Stat
          name="Agility"
          value={stats.agility}
          max={100}
          icon={<Zap className="h-3.5 w-3.5 text-white" />}
          color="#36DE7E"
          recentChange={recentChanges.agility}
        />
        <Stat
          name="Intelligence"
          value={stats.intelligence}
          max={100}
          icon={<Brain className="h-3.5 w-3.5 text-white" />}
          color="#6272D9"
          recentChange={recentChanges.intelligence}
        />
        <Stat
          name="Vitality"
          value={stats.vitality}
          max={100}
          icon={<Heart className="h-3.5 w-3.5 text-white" />}
          color="#9256E5"
          recentChange={recentChanges.vitality}
        />
        <Stat
          name="Charisma"
          value={stats.charisma}
          max={100}
          icon={<MessageSquare className="h-3.5 w-3.5 text-white" />}
          color="#FFB443"
          recentChange={recentChanges.charisma}
        />
      </div>

      <div className="mt-4">
        <Progress
          value={(exp / expToNextLevel) * 100}
          className="h-2"
          style={{ 
            background: "#9256E520",
            '--progress-foreground': "#9256E5"
          } as React.CSSProperties}
        />
        <div className="mt-1 flex justify-between text-xs text-white/60">
          <span>Current EXP: {exp}</span>
          <span>Next Level: {expToNextLevel}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
