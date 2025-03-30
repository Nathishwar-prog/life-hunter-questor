
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import QuestCard from '@/components/QuestCard';
import { useHunter } from '@/context/HunterContext';
import { Button } from '@/components/ui/button';
import { FilterX, Filter, RotateCcw, Sparkles, Award, Trophy, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Quests = () => {
  const { quests, completeQuest, refreshQuests } = useHunter();
  const [filter, setFilter] = useState<string | null>(null);
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const filteredQuests = filter
    ? quests.filter((quest) => quest.category === filter || 
        (filter === 'completed' && quest.completed) || 
        (filter === 'active' && !quest.completed))
    : quests;

  const activeQuests = quests.filter(quest => !quest.completed);
  const completedQuests = quests.filter(quest => quest.completed);
  
  // Calculate daily progress
  useEffect(() => {
    const total = quests.length;
    const completed = completedQuests.length;
    const newProgressValue = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setProgressValue(0);
    setAnimateProgress(true);
    
    const timer = setTimeout(() => {
      setProgressValue(newProgressValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [quests, completedQuests.length]);

  const handleRefreshQuests = () => {
    refreshQuests();
    setShowRefreshDialog(false);
    toast('[System]: Quests have been refreshed!', {
      description: 'New challenges have been generated for you.',
      icon: <Sparkles className="h-5 w-5 text-yellow-500" />,
    });
  };

  const handleFilterClick = (filterValue: string | null) => {
    if (filter === filterValue) {
      setFilter(null);
    } else {
      setFilter(filterValue);
      toast(`Filter applied: ${filterValue || 'All Quests'}`, {
        description: 'Showing filtered quest results',
        duration: 2000,
      });
    }
  };

  return (
    <Layout title="Daily Quests">
      {/* Daily Progress Card */}
      <Card className="mb-6 overflow-hidden bg-gradient-to-r from-hunter-primary to-hunter-secondary border-hunter-accent/30">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" /> 
                Daily Progress
              </h3>
              <p className="text-sm text-white/70 mb-2">
                Complete all quests to maximize your growth
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-white/60" />
              <span className="text-sm">Daily reset in 12:34:56</span>
            </div>
          </div>
          
          <div className="flex flex-col mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <span>{completedQuests.length} of {quests.length} completed</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2 bg-hunter-accent/20" />
          </div>
          
          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge variant="outline" className="bg-hunter-primary/50 hover:bg-hunter-primary/70">
              {activeQuests.length} active
            </Badge>
            <Badge variant="outline" className="bg-hunter-success/20 text-hunter-success hover:bg-hunter-success/30">
              {completedQuests.length} completed
            </Badge>
            <Badge variant="outline" className="bg-hunter-purple/20 text-hunter-purple hover:bg-hunter-purple/30">
              {quests.filter(q => q.category === 'mental').length} mental
            </Badge>
            <Badge variant="outline" className="bg-red-500/20 text-red-500 hover:bg-red-500/30">
              {quests.filter(q => q.category === 'physical').length} physical
            </Badge>
            <Badge variant="outline" className="bg-hunter-blue/20 text-hunter-blue hover:bg-hunter-blue/30">
              {quests.filter(q => q.category === 'intelligence').length} intelligence
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filter buttons */}
      <div className="mb-6 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5 text-white/70" /> 
            Filter Quests
          </h3>
          
          <div className="flex items-center gap-2">
            {filter && (
              <Button variant="outline" onClick={() => setFilter(null)} size="sm">
                <FilterX className="mr-2 h-4 w-4" />
                Clear Filter
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => setShowRefreshDialog(true)}
              size="sm"
              className="border-hunter-accent/30 hover:bg-hunter-accent/20"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh Quests
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filter === null ? "default" : "outline"}
            onClick={() => handleFilterClick(null)}
            className={filter === null ? "bg-hunter-purple hover:bg-hunter-purple/80" : ""}
            size="sm"
          >
            <Award className="mr-1 h-4 w-4" />
            All Quests
          </Button>
          <Button
            variant={filter === 'active' ? "default" : "outline"}
            onClick={() => handleFilterClick('active')}
            className={filter === 'active' ? "bg-hunter-blue hover:bg-hunter-blue/80" : ""}
            size="sm"
          >
            Active ({activeQuests.length})
          </Button>
          <Button
            variant={filter === 'completed' ? "default" : "outline"}
            onClick={() => handleFilterClick('completed')}
            className={filter === 'completed' ? "bg-hunter-success hover:bg-hunter-success/80" : ""}
            size="sm"
          >
            Completed ({completedQuests.length})
          </Button>
          <Button
            variant={filter === 'physical' ? "default" : "outline"}
            onClick={() => handleFilterClick('physical')}
            className={filter === 'physical' ? "bg-red-500 hover:bg-red-500/80" : ""}
            size="sm"
          >
            Physical
          </Button>
          <Button
            variant={filter === 'mental' ? "default" : "outline"}
            onClick={() => handleFilterClick('mental')}
            className={filter === 'mental' ? "bg-hunter-purple hover:bg-hunter-purple/80" : ""}
            size="sm"
          >
            Mental
          </Button>
          <Button
            variant={filter === 'intelligence' ? "default" : "outline"}
            onClick={() => handleFilterClick('intelligence')}
            className={filter === 'intelligence' ? "bg-hunter-blue hover:bg-hunter-blue/80" : ""}
            size="sm"
          >
            Intelligence
          </Button>
        </div>
      </div>

      {/* Quest cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredQuests.length > 0 ? (
          filteredQuests.map((quest) => (
            <QuestCard key={quest.id} quest={quest} onComplete={completeQuest} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-lg bg-hunter-secondary/20 p-8">
            <Filter className="mb-2 h-8 w-8 text-white/60" />
            <h3 className="text-lg font-bold">No quests found</h3>
            <p className="text-center text-sm text-white/70">
              Try changing your filter or refresh quests to generate new ones.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setFilter(null)} 
              className="mt-4 border-hunter-accent/30"
              size="sm"
            >
              <FilterX className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Refresh Quests Dialog */}
      <Dialog open={showRefreshDialog} onOpenChange={setShowRefreshDialog}>
        <DialogContent className="sm:max-w-[425px] bg-hunter-primary border-hunter-accent/30">
          <DialogHeader>
            <DialogTitle>Refresh Quests</DialogTitle>
            <DialogDescription>
              This will generate new quests and apply penalties for any uncompleted quests. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md bg-hunter-secondary/30 p-3 mb-3">
              <h4 className="text-sm font-medium mb-2">Quest Status:</h4>
              <div className="flex justify-between text-sm">
                <span>Active quests:</span>
                <span className="font-bold">{activeQuests.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Completed quests:</span>
                <span className="font-bold">{completedQuests.length}</span>
              </div>
            </div>
            <p className="text-sm text-white/80 bg-red-500/10 p-2 rounded border border-red-500/20">
              <strong>Warning:</strong> Uncompleted quests will result in small stat penalties.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefreshDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRefreshQuests} className="bg-hunter-purple hover:bg-hunter-purple/80">
              <RotateCcw className="mr-2 h-4 w-4" />
              Refresh Quests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Quests;
