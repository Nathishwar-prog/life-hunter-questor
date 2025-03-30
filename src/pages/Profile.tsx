import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useHunter } from '@/context/HunterContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Trophy, Medal, Star, ArrowRight, Shield, RefreshCw, Edit } from 'lucide-react';
import { toast } from 'sonner';
import HunterNameDialog from '@/components/HunterNameDialog';

const Profile = () => {
  const { level, stats, exp, expToNextLevel, refreshQuests, hunterName } = useHunter();
  const [showNameDialog, setShowNameDialog] = useState(false);

  const generateAchievements = () => {
    const achievements = [];
    
    achievements.push({
      title: 'Awakening',
      description: 'Begin your journey as a hunter',
      icon: <Shield className="h-5 w-5" />,
      color: '#9256E5',
      unlocked: true,
      progress: 100,
    });
    
    achievements.push({
      title: 'Novice Hunter',
      description: 'Reach level 5',
      icon: <Award className="h-5 w-5" />,
      color: '#6272D9',
      unlocked: level >= 5,
      progress: Math.min(100, (level / 5) * 100),
    });
    
    achievements.push({
      title: 'Skilled Hunter',
      description: 'Reach level 10',
      icon: <Trophy className="h-5 w-5" />,
      color: '#36DE7E',
      unlocked: level >= 10,
      progress: Math.min(100, (level / 10) * 100),
    });
    
    const statAchievements = [
      {
        title: 'Physical Prowess',
        description: 'Reach 50 Strength',
        icon: <Medal className="h-5 w-5" />,
        color: '#FF5757',
        unlocked: stats.strength >= 50,
        progress: Math.min(100, (stats.strength / 50) * 100),
      },
      {
        title: 'Lightning Reflexes',
        description: 'Reach 50 Agility',
        icon: <Medal className="h-5 w-5" />,
        color: '#36DE7E',
        unlocked: stats.agility >= 50,
        progress: Math.min(100, (stats.agility / 50) * 100),
      },
      {
        title: 'Mind Master',
        description: 'Reach 50 Intelligence',
        icon: <Medal className="h-5 w-5" />,
        color: '#6272D9',
        unlocked: stats.intelligence >= 50,
        progress: Math.min(100, (stats.intelligence / 50) * 100),
      },
      {
        title: 'Endurance Champion',
        description: 'Reach 50 Vitality',
        icon: <Medal className="h-5 w-5" />,
        color: '#9256E5',
        unlocked: stats.vitality >= 50,
        progress: Math.min(100, (stats.vitality / 50) * 100),
      },
      {
        title: 'Social Influence',
        description: 'Reach 50 Charisma',
        icon: <Medal className="h-5 w-5" />,
        color: '#FFB443',
        unlocked: stats.charisma >= 50,
        progress: Math.min(100, (stats.charisma / 50) * 100),
      },
    ];
    
    achievements.push(...statAchievements);
    
    if (Object.values(stats).every(stat => stat >= 25)) {
      achievements.push({
        title: 'Balanced Hunter',
        description: 'Have at least 25 in all stats',
        icon: <Star className="h-5 w-5" />,
        color: 'gold',
        unlocked: true,
        progress: 100,
      });
    } else {
      const minStat = Math.min(...Object.values(stats));
      achievements.push({
        title: 'Balanced Hunter',
        description: 'Have at least 25 in all stats',
        icon: <Star className="h-5 w-5" />,
        color: '#8D8FAD',
        unlocked: false,
        progress: Math.min(100, (minStat / 25) * 100),
      });
    }
    
    return achievements;
  };

  const achievements = generateAchievements();
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      localStorage.clear();
      toast('[System]: Progress has been reset', {
        description: "All stats and quests have been reset to initial values.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <Layout title="Hunter Profile">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <Card className="bg-hunter-primary border-hunter-accent/20 overflow-hidden">
            <CardHeader className="relative">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-hunter-purple opacity-10 blur-xl" />
              <div className="flex flex-col items-center">
                <div className="hunter-badge h-20 w-20 animate-pulse-glow">
                  <Trophy className="h-10 w-10" />
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                    {level}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <CardTitle className="text-xl">
                    {hunterName ? hunterName : 'Hunter Profile'}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full" 
                    onClick={() => setShowNameDialog(true)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <CardDescription>Level {level} Hunter</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between rounded-md bg-hunter-secondary/30 px-3 py-2">
                  <span className="text-sm">Experience</span>
                  <span className="font-medium">{exp}/{expToNextLevel}</span>
                </div>
                <div className="flex justify-between rounded-md bg-hunter-secondary/30 px-3 py-2">
                  <span className="text-sm">Total Stats</span>
                  <span className="font-medium">
                    {Object.values(stats).reduce((sum, stat) => sum + stat, 0)}
                  </span>
                </div>
                <div className="flex justify-between rounded-md bg-hunter-secondary/30 px-3 py-2">
                  <span className="text-sm">Achievements</span>
                  <span className="font-medium">{unlockedAchievements.length}/{achievements.length}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-hunter-purple/30" 
                onClick={refreshQuests}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Today's Quests
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-hunter-danger/30 text-hunter-danger hover:text-hunter-danger"
                onClick={handleResetProgress}
              >
                Reset All Progress
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="quest-card">
            <h3 className="mb-4 text-lg font-semibold">Achievements</h3>
            <div className="space-y-4">
              {unlockedAchievements.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-white/60">UNLOCKED ({unlockedAchievements.length})</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {unlockedAchievements.map((achievement) => (
                      <div key={achievement.title} className="flex items-center gap-3 rounded-lg bg-hunter-secondary/30 p-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: achievement.color }}>
                          {achievement.icon}
                        </span>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-xs text-white/60">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {lockedAchievements.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-white/60">LOCKED ({lockedAchievements.length})</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {lockedAchievements.map((achievement) => (
                      <div key={achievement.title} className="flex items-center gap-3 rounded-lg bg-hunter-secondary/30 p-3 opacity-60">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500">
                          {achievement.icon}
                        </span>
                        <div>
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-xs text-white/60">{achievement.description}</p>
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-700">
                            <div 
                              className="h-full rounded-full bg-gray-400" 
                              style={{ width: `${achievement.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <HunterNameDialog open={showNameDialog} onOpenChange={setShowNameDialog} />
    </Layout>
  );
};

export default Profile;
