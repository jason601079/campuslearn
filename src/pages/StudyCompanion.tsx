import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Zap, Trophy, Star, Sparkles, Target } from "lucide-react";
import { toast } from "sonner";

type CompanionLevel = "Novice" | "Scholar" | "Expert" | "Master" | "Legend";

interface CompanionStats {
  level: CompanionLevel;
  xp: number;
  xpToNextLevel: number;
  streakDays: number;
  totalSessions: number;
  achievements: string[];
}

const LEVEL_THRESHOLDS = {
  Novice: 0,
  Scholar: 100,
  Expert: 300,
  Master: 600,
  Legend: 1000,
};

const COMPANION_FORMS = {
  Novice: "🌱",
  Scholar: "🌿",
  Expert: "🌳",
  Master: "🦉",
  Legend: "🔮",
};

export default function StudyCompanion() {
  const [stats, setStats] = useState<CompanionStats>({
    level: "Novice",
    xp: 0,
    xpToNextLevel: 100,
    streakDays: 0,
    totalSessions: 0,
    achievements: [],
  });

  const [dailyChallenge, setDailyChallenge] = useState({
    completed: false,
    task: "Complete 3 study sessions today",
    reward: 50,
  });

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("studyCompanionStats");
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const saveStats = (newStats: CompanionStats) => {
    setStats(newStats);
    localStorage.setItem("studyCompanionStats", JSON.stringify(newStats));
  };

  const calculateLevel = (xp: number): CompanionLevel => {
    if (xp >= LEVEL_THRESHOLDS.Legend) return "Legend";
    if (xp >= LEVEL_THRESHOLDS.Master) return "Master";
    if (xp >= LEVEL_THRESHOLDS.Expert) return "Expert";
    if (xp >= LEVEL_THRESHOLDS.Scholar) return "Scholar";
    return "Novice";
  };

  const getNextLevelXP = (level: CompanionLevel): number => {
    switch (level) {
      case "Novice":
        return LEVEL_THRESHOLDS.Scholar;
      case "Scholar":
        return LEVEL_THRESHOLDS.Expert;
      case "Expert":
        return LEVEL_THRESHOLDS.Master;
      case "Master":
        return LEVEL_THRESHOLDS.Legend;
      default:
        return 1000;
    }
  };

  const gainXP = (amount: number, source: string) => {
    const newXP = stats.xp + amount;
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel !== stats.level;

    const newStats = {
      ...stats,
      xp: newXP,
      level: newLevel,
      xpToNextLevel: getNextLevelXP(newLevel),
    };

    saveStats(newStats);

    if (leveledUp) {
      toast.success(`Level Up! Your companion evolved to ${newLevel}! ${COMPANION_FORMS[newLevel]}`, {
        duration: 5000,
      });
    } else {
      toast.success(`+${amount} XP from ${source}!`, {
        duration: 2000,
      });
    }
  };

  const completeQuickAction = (action: string, xpReward: number) => {
    gainXP(xpReward, action);
    const newStats = {
      ...stats,
      totalSessions: stats.totalSessions + 1,
    };
    saveStats(newStats);
  };

  const completeDailyChallenge = () => {
    if (!dailyChallenge.completed) {
      setDailyChallenge({ ...dailyChallenge, completed: true });
      gainXP(dailyChallenge.reward, "Daily Challenge");
      
      const newStreak = stats.streakDays + 1;
      const newAchievements = [...stats.achievements];
      
      if (newStreak === 7 && !newAchievements.includes("Week Warrior")) {
        newAchievements.push("Week Warrior");
        toast("🏆 Achievement Unlocked: Week Warrior!", { duration: 3000 });
      }
      
      saveStats({
        ...stats,
        streakDays: newStreak,
        achievements: newAchievements,
      });
    }
  };

  const progressToNextLevel =
    stats.level === "Legend"
      ? 100
      : ((stats.xp - LEVEL_THRESHOLDS[stats.level]) /
          (stats.xpToNextLevel - LEVEL_THRESHOLDS[stats.level])) *
        100;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Study Companion
          </h1>
          <p className="text-muted-foreground mt-1">
            Your personal learning buddy that grows with you
          </p>
        </div>
      </div>

      {/* Main Companion Display */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="text-8xl mb-4 animate-bounce">{COMPANION_FORMS[stats.level]}</div>
          <CardTitle className="text-2xl">
            {stats.level} Companion
          </CardTitle>
          <CardDescription>Level {Object.keys(LEVEL_THRESHOLDS).indexOf(stats.level) + 1}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Experience</span>
              <span className="text-muted-foreground">
                {stats.xp} / {stats.xpToNextLevel} XP
              </span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.streakDays}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.totalSessions}</div>
                <div className="text-xs text-muted-foreground">Total Sessions</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.achievements.length}</div>
                <div className="text-xs text-muted-foreground">Achievements</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Daily Challenge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Daily Challenge
          </CardTitle>
          <CardDescription>Complete to earn bonus XP</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  dailyChallenge.completed ? "bg-primary border-primary" : "border-muted-foreground"
                }`}
              />
              <div>
                <p className="font-medium">{dailyChallenge.task}</p>
                <p className="text-sm text-muted-foreground">+{dailyChallenge.reward} XP</p>
              </div>
            </div>
            <Button
              onClick={completeDailyChallenge}
              disabled={dailyChallenge.completed}
              size="sm"
            >
              {dailyChallenge.completed ? "Completed!" : "Complete"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Quick Study Actions
          </CardTitle>
          <CardDescription>Simulate study activities to level up your companion</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2"
            onClick={() => completeQuickAction("Study Session", 20)}
          >
            <Brain className="h-6 w-6" />
            <span className="text-xs">Study Session</span>
            <span className="text-xs text-muted-foreground">+20 XP</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2"
            onClick={() => completeQuickAction("Practice Quiz", 15)}
          >
            <Target className="h-6 w-6" />
            <span className="text-xs">Practice Quiz</span>
            <span className="text-xs text-muted-foreground">+15 XP</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2"
            onClick={() => completeQuickAction("Resource Read", 10)}
          >
            <Star className="h-6 w-6" />
            <span className="text-xs">Read Resource</span>
            <span className="text-xs text-muted-foreground">+10 XP</span>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col gap-2"
            onClick={() => completeQuickAction("Forum Post", 25)}
          >
            <Sparkles className="h-6 w-6" />
            <span className="text-xs">Forum Post</span>
            <span className="text-xs text-muted-foreground">+25 XP</span>
          </Button>
        </CardContent>
      </Card>

      {/* Achievements */}
      {stats.achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Achievements Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.achievements.map((achievement, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm py-1 px-3">
                  🏆 {achievement}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
