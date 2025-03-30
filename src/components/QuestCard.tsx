
import React, { useState } from 'react';
import { Dumbbell, Brain, Zap, Heart, Star, User, Award, Check, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from '@/lib/utils';

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
  const [isConfirming, setIsConfirming] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  const getCategoryBgColor = (category: QuestCategory) => {
    switch (category) {
      case 'physical':
        return '#FF5757';
      case 'mental':
        return '#9256E5';
      case 'intelligence':
        return '#6272D9';
      default:
        return '#6272D9';
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
      case 'charisma':
        return <User className="h-3.5 w-3.5" />;
      default:
        return <Star className="h-3.5 w-3.5" />;
    }
  };

  const getStatColor = (statType: string) => {
    switch (statType) {
      case 'strength':
        return '#FF5757';
      case 'agility':
        return '#36DE7E';
      case 'intelligence':
        return '#6272D9';
      case 'vitality':
        return '#9256E5';
      case 'charisma':
        return '#FFB443';
      default:
        return '#FFB443';
    }
  };

  const handleCompleteClick = () => {
    if (quest.completed) return;
    
    if (!isConfirming) {
      setIsConfirming(true);
      setTimeout(() => {
        setIsConfirming(false);
      }, 3000);
      return;
    }
    
    onComplete(quest.id);
    setIsConfirming(false);
    
    toast(`[System]: Quest completed! ${quest.statBonus.type} +${quest.statBonus.value}`, {
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      description: `You earned +${quest.exp} EXP`,
    });
  };

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-xl border-hunter-accent/20",
        quest.completed ? "opacity-75" : "hover:scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background glow effect */}
      <div 
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-xl transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${getCategoryBgColor(quest.category)} 0%, ${
            quest.category === 'physical' 
              ? '#ff8c42' 
              : quest.category === 'mental'
              ? '#b66dff'
              : '#56c2e5'
          } 100%)`,
          opacity: isHovering ? "0.3" : "0.2"
        }}
      />
      
      {/* Completed badge overlay */}
      {quest.completed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10 pointer-events-none">
          <div className="bg-hunter-success/80 text-white py-1 px-4 rounded-full rotate-[-20deg] transform font-bold text-sm flex items-center shadow-lg">
            <Check className="mr-1 h-4 w-4" />
            COMPLETED
          </div>
        </div>
      )}
      
      <CardContent className="p-4 relative z-0">
        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-1">
              <span 
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ background: getCategoryBgColor(quest.category) }}
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="rounded-md bg-hunter-primary/70 px-2 py-1 text-sm font-bold text-white">
                  +{quest.exp} EXP
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Experience points gained upon completion</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <p className="mt-2 text-sm text-white/80">{quest.description}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="flex items-center gap-1 rounded-md px-2 py-1"
                  style={{ backgroundColor: `${getStatColor(quest.statBonus.type)}20` }}
                >
                  <span 
                    className="flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ background: getStatColor(quest.statBonus.type) }}
                  >
                    {getStatIcon(quest.statBonus.type)}
                  </span>
                  <span className="text-xs font-medium">
                    {quest.statBonus.type.charAt(0).toUpperCase() + quest.statBonus.type.slice(1)} +{quest.statBonus.value}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Stat bonus upon completion</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex items-center gap-1 text-xs text-white/60">
            <Clock className="h-3 w-3" />
            <span>24h remaining</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleCompleteClick}
          disabled={quest.completed}
          variant={quest.completed ? "outline" : "default"}
          className={cn(
            "w-full transition-all", 
            quest.completed 
              ? "bg-hunter-secondary/30" 
              : isConfirming
              ? "bg-hunter-success hover:bg-hunter-success/80"
              : "bg-hunter-purple hover:bg-hunter-purple/80"
          )}
        >
          {quest.completed 
            ? <><Check className="mr-2 h-4 w-4" /> Completed</>
            : isConfirming
            ? <><Check className="mr-2 h-4 w-4" /> Confirm Completion</>
            : <>Complete Quest</>
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestCard;
