
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useHunter } from '@/context/HunterContext';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dumbbell, Zap, Brain, Heart, MessageSquare, Trophy, ArrowUp, User, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HunterNameDialog from '@/components/HunterNameDialog';
import { Badge } from '@/components/ui/badge';

const Stats = () => {
  const { stats, level, exp, expToNextLevel, recentChanges, hunterName } = useHunter();
  const [showNameDialog, setShowNameDialog] = useState(false);
  
  // Show name dialog on first visit if name is not set
  useEffect(() => {
    if (!hunterName) {
      setShowNameDialog(true);
    }
  }, [hunterName]);

  const statData = [
    {
      name: 'Strength',
      value: stats.strength,
      color: '#FF5757',
      icon: <Dumbbell className="h-5 w-5" />,
      change: recentChanges.strength || 0,
    },
    {
      name: 'Agility',
      value: stats.agility,
      color: '#36DE7E',
      icon: <Zap className="h-5 w-5" />,
      change: recentChanges.agility || 0,
    },
    {
      name: 'Intelligence',
      value: stats.intelligence,
      color: '#6272D9',
      icon: <Brain className="h-5 w-5" />,
      change: recentChanges.intelligence || 0,
    },
    {
      name: 'Vitality',
      value: stats.vitality,
      color: '#9256E5',
      icon: <Heart className="h-5 w-5" />,
      change: recentChanges.vitality || 0,
    },
    {
      name: 'Charisma',
      value: stats.charisma,
      color: '#FFB443',
      icon: <MessageSquare className="h-5 w-5" />,
      change: recentChanges.charisma || 0,
    },
  ];

  const chartData = statData.map((stat) => ({
    name: stat.name,
    value: stat.value,
    fill: stat.color,
  }));

  return (
    <Layout title="Stats & Progress">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Level and XP Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="quest-card overflow-hidden">
            <div className="relative mb-6 flex flex-col items-center">
              <div className="hunter-badge h-20 w-20 animate-pulse-glow">
                <Trophy className="h-10 w-10" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                  {level}
                </span>
              </div>
              
              <div className="mt-4 flex flex-col items-center gap-2">
                {hunterName ? (
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{hunterName}</h2>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 rounded-full" 
                      onClick={() => setShowNameDialog(true)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-sm border-hunter-accent/30 text-hunter-accent"
                    onClick={() => setShowNameDialog(true)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Set Hunter Name
                  </Button>
                )}
                <Badge variant="hunter" className="text-xs">Level {level} Hunter</Badge>
                <p className="text-sm text-white/60">
                  {exp} / {expToNextLevel} EXP to next level
                </p>
              </div>
            </div>

            <Progress
              value={(exp / expToNextLevel) * 100}
              className="h-3 rounded-full"
              style={{ 
                background: "#9256E520",
                '--progress-foreground': "#9256E5"
              } as React.CSSProperties}
            />

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-hunter-secondary/30 p-3">
                <p className="text-xs text-white/60">Total XP</p>
                <p className="text-lg font-bold">{(level - 1) * 100 + exp}</p>
              </div>
              <div className="rounded-lg bg-hunter-secondary/30 p-3">
                <p className="text-xs text-white/60">Needed</p>
                <p className="text-lg font-bold">{expToNextLevel - exp}</p>
              </div>
              <div className="rounded-lg bg-hunter-secondary/30 p-3">
                <p className="text-xs text-white/60">Progress</p>
                <p className="text-lg font-bold">{Math.round((exp / expToNextLevel) * 100)}%</p>
              </div>
            </div>
          </div>

          {/* Individual Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {statData.map((stat) => (
              <div key={stat.name} className="quest-card overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2" style={{ backgroundColor: `${stat.color}30` }}>
                    <div className="rounded-full p-1.5" style={{ backgroundColor: stat.color }}>
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">{stat.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-white/70">
                      <span>{stat.value}/100</span>
                      {stat.change > 0 && (
                        <span className="flex items-center text-hunter-success">
                          <ArrowUp className="h-3 w-3" />
                          {stat.change}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Progress
                  value={stat.value}
                  className="mt-3 h-2"
                  style={{ 
                    background: `${stat.color}30`,
                    '--progress-foreground': stat.color
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Charts and Visualizations */}
        <div className="lg:col-span-8 space-y-6">
          <div className="quest-card overflow-hidden">
            <h3 className="mb-4 text-lg font-semibold">Stats Overview</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#424769" />
                  <XAxis dataKey="name" tick={{ fill: '#8D8FAD' }} />
                  <YAxis tick={{ fill: '#8D8FAD' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#2D3250',
                      borderColor: '#424769',
                      color: '#fff',
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                    label={{
                      position: 'top',
                      fill: '#fff',
                      fontSize: 12,
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="quest-card overflow-hidden">
            <h3 className="mb-4 text-lg font-semibold">Stats Details</h3>
            <div className="space-y-4">
              {statData.map((stat) => (
                <div key={stat.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: stat.color }}>
                        {stat.icon}
                      </span>
                      <span className="font-medium">{stat.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stat.value}/100</span>
                      {stat.change > 0 && (
                        <span className="flex items-center rounded-full bg-hunter-success/20 px-2 py-0.5 text-xs font-medium text-hunter-success">
                          +{stat.change}
                        </span>
                      )}
                    </div>
                  </div>
                  <Progress
                    value={stat.value}
                    className="h-3"
                    style={{ 
                      background: `${stat.color}30`,
                      '--progress-foreground': stat.color
                    } as React.CSSProperties}
                  />
                  <div className="mt-1 grid grid-cols-5">
                    <div className="text-center text-xs text-white/40">20</div>
                    <div className="text-center text-xs text-white/40">40</div>
                    <div className="text-center text-xs text-white/40">60</div>
                    <div className="text-center text-xs text-white/40">80</div>
                    <div className="text-center text-xs text-white/40">100</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <HunterNameDialog open={showNameDialog} onOpenChange={setShowNameDialog} />
    </Layout>
  );
};

export default Stats;
