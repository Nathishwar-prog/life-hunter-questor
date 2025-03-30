
import React from 'react';
import Layout from '@/components/Layout';
import { useHunter } from '@/context/HunterContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Brain, Zap, Heart, MessageSquare, CalendarDays, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Training = () => {
  const { stats, level } = useHunter();

  // Determine the user's strongest and weakest stats
  const statsArray = [
    { name: 'strength', value: stats.strength, icon: <Dumbbell className="h-5 w-5" />, color: '#FF5757' },
    { name: 'agility', value: stats.agility, icon: <Zap className="h-5 w-5" />, color: '#36DE7E' },
    { name: 'intelligence', value: stats.intelligence, icon: <Brain className="h-5 w-5" />, color: '#6272D9' },
    { name: 'vitality', value: stats.vitality, icon: <Heart className="h-5 w-5" />, color: '#9256E5' },
    { name: 'charisma', value: stats.charisma, icon: <MessageSquare className="h-5 w-5" />, color: '#FFB443' },
  ];

  const sortedStats = [...statsArray].sort((a, b) => b.value - a.value);
  const strongestStat = sortedStats[0];
  const weakestStat = sortedStats[sortedStats.length - 1];

  // Generate training plans based on user stats
  const generateTrainingPlans = () => {
    const plans = [
      {
        title: `${weakestStat.name.charAt(0).toUpperCase() + weakestStat.name.slice(1)} Training Focus`,
        description: `A 7-day plan to improve your ${weakestStat.name}, your weakest stat.`,
        icon: weakestStat.icon,
        color: weakestStat.color,
        days: 7,
        difficulty: 'Medium',
        recommended: true,
        focusAreas: [`${weakestStat.name.charAt(0).toUpperCase() + weakestStat.name.slice(1)}`],
        activities: [
          `Daily ${weakestStat.name} exercises - 20 minutes`,
          'Progressive difficulty increase',
          'Specialized training techniques',
        ],
      },
      {
        title: 'Balanced Growth Plan',
        description: 'A comprehensive plan focusing on improving all stats evenly.',
        icon: <CalendarDays className="h-5 w-5" />,
        color: '#9256E5',
        days: 14,
        difficulty: 'Medium',
        recommended: false,
        focusAreas: ['All Stats'],
        activities: [
          'Daily rotation of different stat exercises',
          'Weekly progress tracking',
          'Balance-focused approach',
        ],
      },
      {
        title: `Advanced ${strongestStat.name.charAt(0).toUpperCase() + strongestStat.name.slice(1)} Mastery`,
        description: `Build on your strongest stat (${strongestStat.name}) to reach new heights.`,
        icon: strongestStat.icon,
        color: strongestStat.color,
        days: 10,
        difficulty: 'Hard',
        recommended: level >= 5,
        focusAreas: [`${strongestStat.name.charAt(0).toUpperCase() + strongestStat.name.slice(1)}`],
        activities: [
          'Intensive specialized training',
          'Advanced techniques and challenges',
          'Skill refinement and perfection',
        ],
      },
    ];

    return plans;
  };

  const trainingPlans = generateTrainingPlans();

  const handleActivateTraining = (planTitle: string) => {
    toast(`[System]: ${planTitle} has been activated!`, {
      description: "Your training plan is now ready to follow.",
    });
  };

  return (
    <Layout title="Training Plans">
      <div className="mb-6">
        <p className="text-white/80">
          Training plans provide structured guidance to improve specific stats over time. 
          Choose a plan that aligns with your goals.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trainingPlans.map((plan) => (
          <Card key={plan.title} className="bg-hunter-primary border-hunter-accent/20 overflow-hidden">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10 blur-xl"
              style={{ backgroundColor: plan.color }}
            />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ backgroundColor: plan.color }}>
                    {plan.icon}
                  </span>
                  <CardTitle>{plan.title}</CardTitle>
                </div>
                {plan.recommended && (
                  <span className="rounded-full bg-hunter-success/20 px-2 py-1 text-xs font-medium text-hunter-success">
                    Recommended
                  </span>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md bg-hunter-secondary/30 px-3 py-2">
                  <span className="text-sm">Duration</span>
                  <span className="font-medium">{plan.days} days</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-hunter-secondary/30 px-3 py-2">
                  <span className="text-sm">Difficulty</span>
                  <span className="font-medium">{plan.difficulty}</span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-hunter-secondary/30 px-3 py-2">
                  <span className="text-sm">Focus Areas</span>
                  <div className="flex gap-1">
                    {plan.focusAreas.map((area) => (
                      <span 
                        key={area} 
                        className="rounded-full px-2 py-0.5 text-xs font-medium" 
                        style={{ backgroundColor: `${plan.color}30`, color: plan.color }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="mb-2 text-sm font-medium">Activities:</h4>
                <ul className="space-y-1">
                  {plan.activities.map((activity, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-hunter-success" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                style={{ backgroundColor: plan.color }}
                onClick={() => handleActivateTraining(plan.title)}
              >
                Activate Training Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-hunter-secondary/30 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 text-hunter-blue" />
          <div>
            <h3 className="font-medium">Training Plan Information</h3>
            <p className="text-sm text-white/70">
              Training plans are AI-generated based on your current stats and level. 
              They refresh and adapt as you level up and your stat distribution changes.
              Complete daily quests while following a training plan for optimal growth.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Training;
