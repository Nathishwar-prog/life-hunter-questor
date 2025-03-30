
import React from 'react';
import { Dumbbell, Brain, Zap, Heart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

export type QuestCategory = 'physical' | 'mental' | 'intelligence';

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: 'easy' | 'medium' | 'hard';
  exp: number;
  statBonus: {
    type: 'strength' | 'agility' | 'intelligence' | 'vitality' | 'charisma';
    value: number;
  };
  completed: boolean;
}

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({ quest, onComplete }) => {
  const getCategoryIcon = (category: QuestCategory) => {
    switch (category) {
      case 'physical':
        return <Dumbbell className="h-5 w-5" />;
      case 'mental':
        return <Brain className="h-5 w-5" />;
      case 'intelligence':
        return <Zap className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: QuestCategory) => {
    switch (category) {
      case 'physical':
        return 'from-red-500/20 to-orange-500/20';
      case 'mental':
        return 'from-purple-500/20 to-violet-500/20';
      case 'intelligence':
        return 'from-blue-500/20 to-cyan-500/20';
      default:
        return 'from-gray-500/20 to-gray-600/20';
    }
  };

  const getDifficultyStars = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return (
          <div className="flex">
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <Star className="h-3.5 w-3.5 text-gray-500" />
            <Star className="h-3.5 w-3.5 text-gray-500" />
          </div>
        );
      case 'medium':
        return (
          <div className="flex">
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <Star className="h-3.5 w-3.5 text-gray-500" />
          </div>
        );
      case 'hard':
        return (
          <div className="flex">
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatIcon = (statType: string) => {
    switch (statType) {
      case 'strength':
        return <Dumbbell className="h-3.5 w-3.5" />;
      case 'agility':
        return <Zap className="h-3.5 w-3.5" />;
      case 'intelligence':
        return <Brain className="h-3.5 w-3.5" />;
      case 'vitality':
        return <Heart className="h-3.5 w-3.5" />;
      default:
        return <Star className="h-3.5 w-3.5" />;
    }
  };

  const handleComplete = () => {
    onComplete(quest.id);
    toast(`[System]: Quest completed! ${quest.statBonus.type} +${quest.statBonus.value}`, {
      icon: <Star className="h-5 w-5 text-yellow-500" />,
    });
  };

  return (
    <div className={`quest-card ${quest.completed ? 'opacity-75' : ''}`}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-xl"
        style={{
          background: quest.category === 'physical' 
            ? 'linear-gradient(135deg, #ff5757 0%, #ff8c42 100%)' 
            : quest.category === 'mental'
            ? 'linear-gradient(135deg, #9256e5 0%, #b66dff 100%)'
            : 'linear-gradient(135deg, #6272d9 0%, #56c2e5 100%)'
        }}
      />
      
      <div className="relative flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{
                background: quest.category === 'physical' 
                  ? '#FF5757' 
                  : quest.category === 'mental'
                  ? '#9256E5'
                  : '#6272D9'
              }}
            >
              {getCategoryIcon(quest.category)}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-white/60">
              {quest.category}
            </span>
            <div className="ml-2">{getDifficultyStars(quest.difficulty)}</div>
          </div>
          <h3 className="text-base font-bold">{quest.title}</h3>
        </div>
        <div className="rounded-md bg-hunter-primary/50 px-2 py-1 text-sm font-bold text-white">
          +{quest.exp} EXP
        </div>
      </div>
      
      <p className="mt-2 text-sm text-white/80">{quest.description}</p>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-md bg-hunter-secondary/50 px-2 py-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full"
            style={{
              background: quest.statBonus.type === 'strength' 
                ? '#FF5757' 
                : quest.statBonus.type === 'agility'
                ? '#36DE7E'
                : quest.statBonus.type === 'intelligence'
                ? '#6272D9'
                : quest.statBonus.type === 'vitality'
                ? '#9256E5'
                : '#FFB443'
            }}
          >
            {getStatIcon(quest.statBonus.type)}
          </span>
          <span className="text-xs font-medium">
            {quest.statBonus.type.charAt(0).toUpperCase() + quest.statBonus.type.slice(1)} +{quest.statBonus.value}
          </span>
        </div>
        
        <Button 
          onClick={handleComplete}
          disabled={quest.completed}
          variant={quest.completed ? "outline" : "default"}
          className={quest.completed ? "bg-hunter-secondary/30" : "bg-hunter-purple hover:bg-hunter-purple/80"}
        >
          {quest.completed ? "Completed" : "Complete Quest"}
        </Button>
      </div>
    </div>
  );
};

export default QuestCard;
