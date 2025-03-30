
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import StatsCard from '@/components/StatsCard';
import QuestCard from '@/components/QuestCard';
import SystemMessage from '@/components/SystemMessage';
import { useHunter } from '@/context/HunterContext';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, User, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

  useEffect(() => {
    // Check if it's the first visit to show the welcome dialog
    if (isFirstVisit) {
      // Dialog is controlled by the isFirstVisit state
    }
  }, [isFirstVisit]);

  const activeQuests = quests.filter(quest => !quest.completed).slice(0, 3);
  const completedQuests = quests.filter(quest => quest.completed);
  const questCompletion = (completedQuests.length / quests.length) * 100;

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
            
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-white/80">Daily Quests</span>
                  <span className="text-sm font-medium">{completedQuests.length}/{quests.length}</span>
                </div>
                <Progress 
                  value={questCompletion} 
                  className="h-2"
                  style={{ 
                    background: "#9256E520",
                    '--progress-foreground': "#9256E5"
                  } as React.CSSProperties}
                />
              </div>
              
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-white/80">Level Progress</span>
                  <span className="text-sm font-medium">{exp}/{expToNextLevel}</span>
                </div>
                <Progress 
                  value={(exp / expToNextLevel) * 100} 
                  className="h-2"
                  style={{ 
                    background: "#6272D920",
                    '--progress-foreground': "#6272D9"
                  } as React.CSSProperties}
                />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/stats">
                <Button variant="outline" className="w-full border-hunter-accent/30 bg-hunter-secondary/30">
                  <User className="mr-2 h-4 w-4" />
                  <span>View Stats</span>
                </Button>
              </Link>
              <Link to="/quests">
                <Button variant="outline" className="w-full border-hunter-accent/30 bg-hunter-secondary/30">
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
          <div className="quest-card">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Today's Quests</h3>
              <Link to="/quests">
                <Button variant="link" className="text-hunter-purple">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-4 space-y-4">
              {activeQuests.length > 0 ? (
                activeQuests.map((quest) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    onComplete={completeQuest} 
                  />
                ))
              ) : completedQuests.length === quests.length ? (
                <div className="flex flex-col items-center justify-center rounded-lg bg-hunter-secondary/20 p-6">
                  <Sparkles className="mb-2 h-8 w-8 text-yellow-500" />
                  <h3 className="text-lg font-bold">All Quests Completed!</h3>
                  <p className="text-center text-sm text-white/70">
                    Great job, Hunter! You've completed all of today's quests.
                    Check back tomorrow for new challenges.
                  </p>
                </div>
              ) : (
                <p className="text-center text-white/70">No active quests. View all quests to find more.</p>
              )}
            </div>
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

          <Button onClick={setFirstVisitComplete} className="bg-hunter-purple hover:bg-hunter-purple/80 w-full">
            Begin Your Hunt
          </Button>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
