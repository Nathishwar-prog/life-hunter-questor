import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Quest, QuestCategory } from '@/components/QuestCard';
import { speak } from '@/utils/voiceAssistant';

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
  hunterName: string;
  setHunterName: (name: string) => void;
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
  const [hunterName, setHunterName] = useState<string>(() => {
    const savedName = localStorage.getItem('hunter_name');
    return savedName || '';
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

  useEffect(() => {
    localStorage.setItem('hunter_name', hunterName);
  }, [hunterName]);

  useEffect(() => {
    const lastRefresh = localStorage.getItem('hunter_last_refresh');
    const now = new Date().toISOString();
    
    if (!lastRefresh) {
      localStorage.setItem('hunter_last_refresh', now);
      return;
    }
    
    const lastRefreshDate = new Date(lastRefresh);
    const currentDate = new Date();
    
    if (
      lastRefreshDate.getDate() !== currentDate.getDate() ||
      lastRefreshDate.getMonth() !== currentDate.getMonth() ||
      lastRefreshDate.getFullYear() !== currentDate.getFullYear()
    ) {
      refreshQuests();
      localStorage.setItem('hunter_last_refresh', now);
      
      setRecentChanges({});
      
      const message = "New day, new quests! Your hunt continues...";
      addSystemMessage(message);
      speak(message, true);
      
      toast("[System]: Daily quests have been refreshed!", {
        description: "Complete your tasks to grow stronger!",
      });
    }
  }, []);

  useEffect(() => {
    if (isFirstVisit && hunterName) {
      const welcomeMessage = `Welcome back, Hunter ${hunterName}! You are level ${level}. Ready to continue your journey?`;
      speak(welcomeMessage, true);
    }
  }, [isFirstVisit, hunterName, level]);

  const completeQuest = (questId: string) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) => {
        if (quest.id === questId && !quest.completed) {
          updateStats(quest.statBonus.type, quest.statBonus.value);
          const newExp = exp + quest.exp;
          setExp(newExp);
          
          const questCompletionMessage = `Quest completed! You gained ${quest.exp} experience and increased your ${quest.statBonus.type} by ${quest.statBonus.value}.`;
          speak(questCompletionMessage);
          
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
      
      setStats((prevStats) => ({
        strength: prevStats.strength + 1,
        agility: prevStats.agility + 1,
        intelligence: prevStats.intelligence + 1,
        vitality: prevStats.vitality + 1,
        charisma: prevStats.charisma + 1,
      }));
      
      const levelUpMessage = `Congratulations Hunter! You've reached level ${newLevel}! All stats increased by 1.`;
      addSystemMessage(`You've reached level ${newLevel}! All stats increased by 1.`);
      speak(levelUpMessage, true);
      
      toast(`[System]: Level Up! You are now Level ${newLevel}`, {
        description: "All stats have increased!",
      });
      
      if (newLevel % 5 === 0) {
        const bossMessage = `A boss battle has appeared! Defeat it to earn special rewards.`;
        addSystemMessage(bossMessage);
        speak(bossMessage);
        // TODO: Implement boss battles
      }
      
      return newLevel;
    });
  };

  function generateQuests(): Quest[] {
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

    const selectRandom = (arr: any[], count: number) => {
      const shuffled = [...arr].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const selectedPhysical = selectRandom(physicalQuests, 1);
    const selectedMental = selectRandom(mentalQuests, 1);
    const selectedIntelligence = selectRandom(intelligenceQuests, 1);

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

    return [...selectedPhysical, ...selectedMental, ...selectedIntelligence, ...additionalQuests].map(
      (quest) => ({
        ...quest,
        id: uuidv4(),
        completed: false,
      })
    );
  }

  const refreshQuests = () => {
    const incompleteQuests = quests.filter((quest) => !quest.completed);
    
    if (incompleteQuests.length > 0) {
      incompleteQuests.forEach((quest) => {
        const statType = quest.statBonus.type;
        const penalty = -1;
        
        updateStats(statType, penalty);
        
        const failureMessage = `You failed to complete "${quest.title}". ${statType.charAt(0).toUpperCase() + statType.slice(1)} ${penalty}.`;
        addSystemMessage(failureMessage);
      });
      
      speak(`You failed to complete ${incompleteQuests.length} quests. Some stats were reduced.`);
    }
    
    setQuests(generateQuests());
    speak("New quests have been generated. Check them out now!");
  };

  const addSystemMessage = (message: string) => {
    setSystemMessages((prev) => [...prev, message]);
  };

  const setFirstVisitComplete = () => {
    setIsFirstVisit(false);
    localStorage.setItem('hunter_first_visit', 'completed');
  };

  const setHunterNameWithVoice = (name: string) => {
    setHunterName(name);
    
    if (name) {
      speak(`Welcome, Hunter ${name}! Your journey begins now.`, true);
    }
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
        hunterName,
        setHunterName: setHunterNameWithVoice,
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
