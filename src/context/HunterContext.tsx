
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Quest, QuestCategory } from '@/components/QuestCard';

interface HunterStats {
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  charisma: number;
}

interface RecentChanges {
  strength?: number;
  agility?: number;
  intelligence?: number;
  vitality?: number;
  charisma?: number;
}

interface HunterContextType {
  stats: HunterStats;
  level: number;
  exp: number;
  expToNextLevel: number;
  recentChanges: RecentChanges;
  quests: Quest[];
  systemMessages: string[];
  isFirstVisit: boolean;
  completeQuest: (questId: string) => void;
  refreshQuests: () => void;
  addSystemMessage: (message: string) => void;
  setFirstVisitComplete: () => void;
}

const initialStats: HunterStats = {
  strength: 10,
  agility: 10,
  intelligence: 10,
  vitality: 10,
  charisma: 10,
};

const HunterContext = createContext<HunterContextType | undefined>(undefined);

export const HunterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<HunterStats>(() => {
    const savedStats = localStorage.getItem('hunter_stats');
    return savedStats ? JSON.parse(savedStats) : initialStats;
  });
  const [level, setLevel] = useState<number>(() => {
    const savedLevel = localStorage.getItem('hunter_level');
    return savedLevel ? parseInt(savedLevel) : 1;
  });
  const [exp, setExp] = useState<number>(() => {
    const savedExp = localStorage.getItem('hunter_exp');
    return savedExp ? parseInt(savedExp) : 0;
  });
  const [quests, setQuests] = useState<Quest[]>(() => {
    const savedQuests = localStorage.getItem('hunter_quests');
    return savedQuests ? JSON.parse(savedQuests) : generateQuests();
  });
  const [systemMessages, setSystemMessages] = useState<string[]>([]);
  const [recentChanges, setRecentChanges] = useState<RecentChanges>({});
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    return localStorage.getItem('hunter_first_visit') !== 'completed';
  });

  const expToNextLevel = level * 100;

  useEffect(() => {
    localStorage.setItem('hunter_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('hunter_level', level.toString());
  }, [level]);

  useEffect(() => {
    localStorage.setItem('hunter_exp', exp.toString());
  }, [exp]);

  useEffect(() => {
    localStorage.setItem('hunter_quests', JSON.stringify(quests));
  }, [quests]);

  // Check if quests need refreshing (every 24 hours)
  useEffect(() => {
    const lastRefresh = localStorage.getItem('hunter_last_refresh');
    const now = new Date().toISOString();
    
    if (!lastRefresh) {
      // First time setup
      localStorage.setItem('hunter_last_refresh', now);
      return;
    }
    
    const lastRefreshDate = new Date(lastRefresh);
    const currentDate = new Date();
    
    // Check if it's a new day
    if (
      lastRefreshDate.getDate() !== currentDate.getDate() ||
      lastRefreshDate.getMonth() !== currentDate.getMonth() ||
      lastRefreshDate.getFullYear() !== currentDate.getFullYear()
    ) {
      refreshQuests();
      localStorage.setItem('hunter_last_refresh', now);
      
      // Reset stats changes
      setRecentChanges({});
      
      // Add system message
      addSystemMessage("New day, new quests! Your hunt continues...");
      toast("[System]: Daily quests have been refreshed!", {
        description: "Complete your tasks to grow stronger!",
      });
    }
  }, []);

  const completeQuest = (questId: string) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) => {
        if (quest.id === questId && !quest.completed) {
          // Update stats based on quest completion
          updateStats(quest.statBonus.type, quest.statBonus.value);
          
          // Add EXP
          const newExp = exp + quest.exp;
          setExp(newExp);
          
          // Check for level up
          if (newExp >= expToNextLevel) {
            levelUp();
          }
          
          return { ...quest, completed: true };
        }
        return quest;
      })
    );
  };

  const updateStats = (statType: string, value: number) => {
    setStats((prevStats) => {
      const newStats = { ...prevStats };
      newStats[statType as keyof HunterStats] += value;
      
      // Update recent changes
      setRecentChanges((prev) => ({
        ...prev,
        [statType]: (prev[statType as keyof RecentChanges] || 0) + value,
      }));
      
      return newStats;
    });
  };

  const levelUp = () => {
    setLevel((prevLevel) => {
      const newLevel = prevLevel + 1;
      setExp(0);
      
      // Bonus for leveling up
      setStats((prevStats) => ({
        strength: prevStats.strength + 1,
        agility: prevStats.agility + 1,
        intelligence: prevStats.intelligence + 1,
        vitality: prevStats.vitality + 1,
        charisma: prevStats.charisma + 1,
      }));
      
      addSystemMessage(`You've reached level ${newLevel}! All stats increased by 1.`);
      toast(`[System]: Level Up! You are now Level ${newLevel}`, {
        description: "All stats have increased!",
      });
      
      // Every 5 levels, trigger a boss battle
      if (newLevel % 5 === 0) {
        addSystemMessage(`A boss battle has appeared! Defeat it to earn special rewards.`);
        // TODO: Implement boss battles
      }
      
      return newLevel;
    });
  };

  function generateQuests(): Quest[] {
    // Physical quests
    const physicalQuests = [
      {
        title: "Morning Exercise Routine",
        description: "Complete a 15-minute morning exercise routine to energize your day.",
        category: 'physical' as QuestCategory,
        difficulty: 'easy' as const,
        exp: 20,
        statBonus: { type: 'strength' as const, value: 2 },
      },
      {
        title: "Cardio Challenge",
        description: "Complete a 20-minute cardio session to improve your endurance.",
        category: 'physical' as QuestCategory,
        difficulty: 'medium' as const,
        exp: 30,
        statBonus: { type: 'agility' as const, value: 2 },
      },
      {
        title: "Strength Training",
        description: "Complete 3 sets of 10 push-ups, squats, and lunges.",
        category: 'physical' as QuestCategory,
        difficulty: 'medium' as const,
        exp: 30,
        statBonus: { type: 'strength' as const, value: 3 },
      },
      {
        title: "Endurance Builder",
        description: "Go for a 30-minute jog or run to build stamina.",
        category: 'physical' as QuestCategory,
        difficulty: 'hard' as const,
        exp: 40,
        statBonus: { type: 'vitality' as const, value: 3 },
      },
    ];

    // Mental quests
    const mentalQuests = [
      {
        title: "Mindfulness Meditation",
        description: "Practice 10 minutes of focused meditation to clear your mind.",
        category: 'mental' as QuestCategory,
        difficulty: 'easy' as const,
        exp: 20,
        statBonus: { type: 'vitality' as const, value: 2 },
      },
      {
        title: "Deep Focus Session",
        description: "Complete 25 minutes of uninterrupted work using the Pomodoro technique.",
        category: 'mental' as QuestCategory,
        difficulty: 'medium' as const,
        exp: 30,
        statBonus: { type: 'intelligence' as const, value: 2 },
      },
      {
        title: "Stress Management",
        description: "Practice deep breathing exercises for 15 minutes to reduce stress.",
        category: 'mental' as QuestCategory,
        difficulty: 'medium' as const,
        exp: 25,
        statBonus: { type: 'vitality' as const, value: 2 },
      },
      {
        title: "Emotional Resilience",
        description: "Write a reflective journal entry about a recent challenge and how you overcame it.",
        category: 'mental' as QuestCategory,
        difficulty: 'hard' as const,
        exp: 35,
        statBonus: { type: 'charisma' as const, value: 3 },
      },
    ];

    // Intelligence quests
    const intelligenceQuests = [
      {
        title: "Reading Session",
        description: "Read a book or educational article for 20 minutes to expand your knowledge.",
        category: 'intelligence' as QuestCategory,
        difficulty: 'easy' as const,
        exp: 20,
        statBonus: { type: 'intelligence' as const, value: 2 },
      },
      {
        title: "Problem Solving",
        description: "Complete a challenging puzzle or brain teaser to improve critical thinking.",
        category: 'intelligence' as QuestCategory,
        difficulty: 'medium' as const,
        exp: 30,
        statBonus: { type: 'intelligence' as const, value: 3 },
      },
      {
        title: "New Skill Acquisition",
        description: "Spend 30 minutes learning a new skill or studying a new topic.",
        category: 'intelligence' as QuestCategory,
        difficulty: 'medium' as const,
        exp: 35,
        statBonus: { type: 'intelligence' as const, value: 3 },
      },
      {
        title: "Creative Expression",
        description: "Spend 30 minutes writing, drawing, or engaging in another creative activity.",
        category: 'intelligence' as QuestCategory,
        difficulty: 'hard' as const,
        exp: 40,
        statBonus: { type: 'charisma' as const, value: 3 },
      },
    ];

    // Select random quests from each category
    const selectRandom = (arr: any[], count: number) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const selectedPhysical = selectRandom(physicalQuests, 1);
    const selectedMental = selectRandom(mentalQuests, 1);
    const selectedIntelligence = selectRandom(intelligenceQuests, 1);

    // Additional random quest from any category for variety
    const allQuests = [...physicalQuests, ...mentalQuests, ...intelligenceQuests];
    const additionalQuests = selectRandom(
      allQuests.filter(
        (q) =>
          !selectedPhysical.includes(q) &&
          !selectedMental.includes(q) &&
          !selectedIntelligence.includes(q)
      ),
      2
    );

    // Combine selected quests and add IDs and completion status
    return [...selectedPhysical, ...selectedMental, ...selectedIntelligence, ...additionalQuests].map(
      (quest) => ({
        ...quest,
        id: uuidv4(),
        completed: false,
      })
    );
  }

  const refreshQuests = () => {
    // Check for any incomplete quests
    const incompleteQuests = quests.filter((quest) => !quest.completed);
    
    if (incompleteQuests.length > 0) {
      // Apply penalties for incomplete quests
      incompleteQuests.forEach((quest) => {
        const statType = quest.statBonus.type;
        const penalty = -1; // Small penalty
        
        updateStats(statType, penalty);
        
        addSystemMessage(`You failed to complete "${quest.title}". ${statType.charAt(0).toUpperCase() + statType.slice(1)} ${penalty}.`);
      });
    }
    
    // Generate new quests
    setQuests(generateQuests());
  };

  const addSystemMessage = (message: string) => {
    setSystemMessages((prev) => [...prev, message]);
  };

  const setFirstVisitComplete = () => {
    setIsFirstVisit(false);
    localStorage.setItem('hunter_first_visit', 'completed');
  };

  return (
    <HunterContext.Provider
      value={{
        stats,
        level,
        exp,
        expToNextLevel,
        recentChanges,
        quests,
        systemMessages,
        isFirstVisit,
        completeQuest,
        refreshQuests,
        addSystemMessage,
        setFirstVisitComplete,
      }}
    >
      {children}
    </HunterContext.Provider>
  );
};

export const useHunter = () => {
  const context = useContext(HunterContext);
  if (context === undefined) {
    throw new Error('useHunter must be used within a HunterProvider');
  }
  return context;
};
