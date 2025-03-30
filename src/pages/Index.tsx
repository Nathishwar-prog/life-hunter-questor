
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import QuestCard from '@/components/QuestCard';
import SystemMessage from '@/components/SystemMessage';
import { useHunter } from '@/context/HunterContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, User, Trophy, Calendar, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Index = () => {
  const { 
    stats, 
    level, 
    exp, 
    expToNextLevel, 
    quests, 
    completeQuest, 
    recentChanges,
    isFirstVisit,
    setFirstVisitComplete
  } = useHunter();

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    // Check if it's the first visit to show the welcome dialog
    if (isFirstVisit) {
      // Dialog is controlled by the isFirstVisit state
    }
  }, [isFirstVisit]);

  const allQuests = quests;
  const activeQuests = quests.filter(quest => !quest.completed);
  const completedQuests = quests.filter(quest => quest.completed);
  const questCompletion = (completedQuests.length / quests.length) * 100;

  const getFilteredQuests = () => {
    switch (selectedFilter) {
      case 'all':
        return allQuests.slice(0, 4);
      case 'active':
        return activeQuests.slice(0, 4);
      case 'completed':
        return completedQuests.slice(0, 4);
      default:
        return activeQuests.slice(0, 4);
    }
  };

  const displayQuests = getFilteredQuests();

  const handleInfoClick = () => {
    setShowHelp(true);
  };

  return (
    <Layout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-12">
        {/* Stats Column */}
        <div className="md:col-span-4 space-y-6">
          <StatsCard 
            stats={stats} 
            level={level} 
            exp={exp} 
            expToNextLevel={expToNextLevel}
            recentChanges={recentChanges} 
          />
          
          <div className="quest-card">
            <h3 className="mb-3 text-lg font-semibold text-white">Progress Tracker</h3>
            
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-white/80">Daily Quests</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{completedQuests.length}/{quests.length}</span>
                    <Badge variant={questCompletion === 100 ? "success" : "hunter"}>
                      {questCompletion === 100 ? 'Complete' : `${questCompletion.toFixed(0)}%`}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={questCompletion} 
                  className="h-2"
                  indicatorColor="#9256E5"
                />
              </div>
              
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-white/80">Level Progress</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{exp}/{expToNextLevel}</span>
                    <Badge variant="hunter">{((exp / expToNextLevel) * 100).toFixed(0)}%</Badge>
                  </div>
                </div>
                <Progress 
                  value={(exp / expToNextLevel) * 100} 
                  className="h-2"
                  indicatorColor="#6272D9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-hunter-secondary/20 rounded-md p-3 border border-hunter-accent/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/80">Next Reset</span>
                    <Badge variant="hunter" className="font-mono">24:00:00</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="h-4 w-4 text-hunter-accent/80" />
                    <span className="text-sm">Daily</span>
                  </div>
                </div>
                
                <div className="bg-hunter-secondary/20 rounded-md p-3 border border-hunter-accent/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/80">Hunter Rank</span>
                    <Badge variant="hunter" className="font-mono">#{level + 54}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">D-Rank</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/stats">
                <Button variant="outline" className="w-full border-hunter-accent/30 bg-hunter-secondary/30 hover:bg-hunter-secondary/50 transition-all duration-300">
                  <User className="mr-2 h-4 w-4" />
                  <span>View Stats</span>
                </Button>
              </Link>
              <Link to="/quests">
                <Button variant="outline" className="w-full border-hunter-accent/30 bg-hunter-secondary/30 hover:bg-hunter-secondary/50 transition-all duration-300">
                  <Trophy className="mr-2 h-4 w-4" />
                  <span>All Quests</span>
                </Button>
              </Link>
            </div>
          </div>
          
          <SystemMessage 
            type="info" 
            message="Welcome to the Life Hunter System. Complete quests to increase your stats and level up!" 
          />
        </div>
        
        {/* Quests Column */}
        <div className="md:col-span-8 space-y-6">
          <div className="quest-card relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">Today's Quests</h3>
                <button 
                  onClick={handleInfoClick}
                  className="rounded-full bg-hunter-secondary/30 p-1 hover:bg-hunter-secondary/50 transition-all"
                >
                  <Info className="h-4 w-4 text-hunter-accent" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedFilter('active')}
                  className={cn(
                    "px-3 text-sm", 
                    selectedFilter === 'active' 
                      ? "bg-hunter-secondary/50 text-white" 
                      : "text-white/60 hover:text-white hover:bg-hunter-secondary/30"
                  )}
                >
                  Active
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedFilter('completed')}
                  className={cn(
                    "px-3 text-sm", 
                    selectedFilter === 'completed' 
                      ? "bg-hunter-secondary/50 text-white" 
                      : "text-white/60 hover:text-white hover:bg-hunter-secondary/30"
                  )}
                >
                  Completed
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                  className={cn(
                    "px-3 text-sm", 
                    selectedFilter === 'all' 
                      ? "bg-hunter-secondary/50 text-white" 
                      : "text-white/60 hover:text-white hover:bg-hunter-secondary/30"
                  )}
                >
                  All
                </Button>

                <Link to="/quests">
                  <Button variant="ghost" size="sm" className="px-3 text-white/60 hover:text-white hover:bg-hunter-secondary/30">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="mt-4 space-y-4">
              {displayQuests.length > 0 ? (
                displayQuests.map((quest) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onComplete={completeQuest} 
                  />
                ))
              ) : selectedFilter === 'completed' && completedQuests.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg bg-hunter-secondary/20 p-6">
                  <Calendar className="mb-2 h-8 w-8 text-hunter-accent/70" />
                  <h3 className="text-lg font-bold">No Completed Quests</h3>
                  <p className="text-center text-sm text-white/70">
                    You haven't completed any quests yet.
                    Complete quests to see them here.
                  </p>
                </div>
              ) : activeQuests.length === 0 && selectedFilter === 'active' ? (
                <div className="flex flex-col items-center justify-center rounded-lg bg-hunter-secondary/20 p-6">
                  <Sparkles className="mb-2 h-8 w-8 text-yellow-500" />
                  <h3 className="text-lg font-bold">All Quests Completed!</h3>
                  <p className="text-center text-sm text-white/70">
                    Great job, Hunter! You've completed all of today's quests.
                    Check back tomorrow for new challenges.
                  </p>
                </div>
              ) : (
                <p className="text-center text-white/70">No quests found for the selected filter.</p>
              )}
            </div>

            {displayQuests.length > 0 && displayQuests.length < allQuests.length && (
              <div className="mt-4 flex justify-center">
                <Link to="/quests">
                  <Button variant="outline" size="sm" className="border-hunter-accent/30 bg-hunter-secondary/30 hover:bg-hunter-secondary/50">
                    View All Quests
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* First Visit Welcome Dialog */}
      <Dialog open={isFirstVisit} onOpenChange={(open) => {
        if (!open) setFirstVisitComplete();
      }}>
        <DialogContent className="sm:max-w-[500px] bg-hunter-primary border-hunter-accent/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Welcome to the Life Hunter System
            </DialogTitle>
            <DialogDescription className="text-center text-white/80">
              Your journey to become the strongest hunter begins now.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-white/90">
              The Life Hunter System will help you track your personal growth across:
            </p>
            <ul className="ml-6 space-y-2 list-disc text-white/80">
              <li>Physical strength and agility</li>
              <li>Mental resilience and focus</li>
              <li>Intelligence and knowledge</li>
              <li>Social skills and charisma</li>
              <li>Vitality and overall health</li>
            </ul>
            <p className="text-white/90">
              Complete daily quests to gain experience, level up, and increase your stats!
            </p>
          </div>

          <Button 
            onClick={() => {
              setFirstVisitComplete();
              toast("Welcome to the Life Hunter System!", {
                description: "Your journey to become the strongest hunter begins now."
              });
            }} 
            className="bg-hunter-purple hover:bg-hunter-purple/80 w-full"
          >
            Begin Your Hunt
          </Button>
        </DialogContent>
      </Dialog>

      {/* Help Dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="sm:max-w-[500px] bg-hunter-primary border-hunter-accent/30">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Quest System Guide
            </DialogTitle>
            <DialogDescription className="text-center text-white/80">
              Understanding how quests work
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2 border-b border-hunter-accent/20 pb-3">
              <h4 className="font-semibold">Quest Types</h4>
              <ul className="ml-4 space-y-1 list-disc text-white/80 text-sm">
                <li><span className="text-red-400 font-medium">Physical</span>: Improves Strength and Agility</li>
                <li><span className="text-purple-400 font-medium">Mental</span>: Improves Vitality and Charisma</li>
                <li><span className="text-blue-400 font-medium">Intelligence</span>: Improves Intelligence</li>
              </ul>
            </div>
            
            <div className="space-y-2 border-b border-hunter-accent/20 pb-3">
              <h4 className="font-semibold">Difficulty Levels</h4>
              <ul className="ml-4 space-y-1 list-disc text-white/80 text-sm">
                <li><span className="text-yellow-400">★</span>: Easy quests - Low EXP, small stat boost</li>
                <li><span className="text-yellow-400">★★</span>: Medium quests - Medium EXP, moderate stat boost</li>
                <li><span className="text-yellow-400">★★★</span>: Hard quests - High EXP, large stat boost</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Quest Completion</h4>
              <p className="text-white/80 text-sm">
                Click the "Complete Quest" button when you've finished a quest. You'll need to confirm completion.
                Completed quests will reward you with EXP and stat boosts immediately.
              </p>
            </div>
          </div>

          <Button 
            onClick={() => setShowHelp(false)} 
            className="bg-hunter-purple hover:bg-hunter-purple/80 w-full"
          >
            Got It
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
