
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import QuestCard from '@/components/QuestCard';
import { useHunter } from '@/context/HunterContext';
import { Button } from '@/components/ui/button';
import { FilterX, Filter, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Quests = () => {
  const { quests, completeQuest, refreshQuests } = useHunter();
  const [filter, setFilter] = useState<string | null>(null);
  const [showRefreshDialog, setShowRefreshDialog] = useState(false);

  const filteredQuests = filter
    ? quests.filter((quest) => quest.category === filter || 
        (filter === 'completed' && quest.completed) || 
        (filter === 'active' && !quest.completed))
    : quests;

  const activeQuests = quests.filter(quest => !quest.completed);
  const completedQuests = quests.filter(quest => quest.completed);

  const handleRefreshQuests = () => {
    refreshQuests();
    setShowRefreshDialog(false);
    toast('[System]: Quests have been refreshed!', {
      description: 'New challenges have been generated for you.',
    });
  };

  return (
    <Layout title="Daily Quests">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={filter === null ? "default" : "outline"}
            onClick={() => setFilter(null)}
            className={filter === null ? "bg-hunter-purple hover:bg-hunter-purple/80" : ""}
          >
            All Quests
          </Button>
          <Button
            variant={filter === 'active' ? "default" : "outline"}
            onClick={() => setFilter('active')}
            className={filter === 'active' ? "bg-hunter-blue hover:bg-hunter-blue/80" : ""}
          >
            Active ({activeQuests.length})
          </Button>
          <Button
            variant={filter === 'completed' ? "default" : "outline"}
            onClick={() => setFilter('completed')}
            className={filter === 'completed' ? "bg-hunter-success hover:bg-hunter-success/80" : ""}
          >
            Completed ({completedQuests.length})
          </Button>
          <Button
            variant={filter === 'physical' ? "default" : "outline"}
            onClick={() => setFilter('physical')}
            className={filter === 'physical' ? "bg-red-500 hover:bg-red-500/80" : ""}
          >
            Physical
          </Button>
          <Button
            variant={filter === 'mental' ? "default" : "outline"}
            onClick={() => setFilter('mental')}
            className={filter === 'mental' ? "bg-hunter-purple hover:bg-hunter-purple/80" : ""}
          >
            Mental
          </Button>
          <Button
            variant={filter === 'intelligence' ? "default" : "outline"}
            onClick={() => setFilter('intelligence')}
            className={filter === 'intelligence' ? "bg-hunter-blue hover:bg-hunter-blue/80" : ""}
          >
            Intelligence
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {filter && (
            <Button variant="outline" onClick={() => setFilter(null)}>
              <FilterX className="mr-2 h-4 w-4" />
              Clear Filter
            </Button>
          )}
          <Button 
            variant="outline" 
            onClick={() => setShowRefreshDialog(true)}
            className="border-hunter-accent/30"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Refresh Quests
          </Button>
        </div>
      </div>

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
            <p className="text-sm text-white/80">
              Active quests: <span className="font-bold">{activeQuests.length}</span>
            </p>
            <p className="text-sm text-white/80">
              Uncompleted quests will result in small stat penalties.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefreshDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRefreshQuests} className="bg-hunter-purple hover:bg-hunter-purple/80">
              Refresh Quests
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Quests;
