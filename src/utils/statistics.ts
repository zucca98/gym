import { WorkoutLog, Exercise, Workout } from '../types';

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // in seconds
  averageDuration: number; // in seconds
  currentStreak: number;
  longestStreak: number;
  favoriteWorkoutType: string;
  mostUsedExercises: Array<{ exerciseId: string; count: number; name: string }>;
  weeklyProgress: Array<{ week: string; count: number }>;
  monthlyProgress: Array<{ month: string; count: number; duration: number }>;
  feelingTrend: Array<{ date: string; feeling: number }>;
}

export function calculateWorkoutStats(
  workoutLogs: WorkoutLog[],
  workouts: Workout[],
  exercises: Exercise[]
): WorkoutStats {
  if (workoutLogs.length === 0) {
    return {
      totalWorkouts: 0,
      totalDuration: 0,
      averageDuration: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoriteWorkoutType: 'N/A',
      mostUsedExercises: [],
      weeklyProgress: [],
      monthlyProgress: [],
      feelingTrend: [],
    };
  }

  // Sort logs by date
  const sortedLogs = [...workoutLogs].sort((a, b) => a.date.getTime() - b.date.getTime());
  const totalWorkouts = workoutLogs.length;
  const totalDuration = workoutLogs.reduce((sum, log) => sum + log.duration, 0);
  const averageDuration = totalDuration / totalWorkouts;

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(sortedLogs);

  // Find favorite workout type
  const workoutTypeCounts = new Map<string, number>();
  workoutLogs.forEach(log => {
    const workout = workouts.find(w => w.id === log.workoutId);
    if (workout) {
      const count = workoutTypeCounts.get(workout.type) || 0;
      workoutTypeCounts.set(workout.type, count + 1);
    }
  });

  const favoriteWorkoutType = Array.from(workoutTypeCounts.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Calculate most used exercises
  const exerciseCounts = new Map<string, number>();
  workoutLogs.forEach(log => {
    log.exerciseResults.forEach(result => {
      const count = exerciseCounts.get(result.exerciseId) || 0;
      exerciseCounts.set(result.exerciseId, count + 1);
    });
  });

  const mostUsedExercises = Array.from(exerciseCounts.entries())
    .map(([exerciseId, count]) => {
      const exercise = exercises.find(e => e.id === exerciseId);
      return {
        exerciseId,
        count,
        name: exercise?.name || 'Unknown Exercise'
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate weekly progress (last 12 weeks)
  const weeklyProgress = calculateWeeklyProgress(sortedLogs);

  // Calculate monthly progress (last 12 months)
  const monthlyProgress = calculateMonthlyProgress(sortedLogs);

  // Calculate feeling trend (last 30 days)
  const feelingTrend = calculateFeelingTrend(sortedLogs);

  return {
    totalWorkouts,
    totalDuration,
    averageDuration,
    currentStreak,
    longestStreak,
    favoriteWorkoutType,
    mostUsedExercises,
    weeklyProgress,
    monthlyProgress,
    feelingTrend,
  };
}

function calculateStreaks(sortedLogs: WorkoutLog[]): { currentStreak: number; longestStreak: number } {
  if (sortedLogs.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if there's a workout today or yesterday for current streak
  const lastWorkoutDate = new Date(sortedLogs[sortedLogs.length - 1].date);
  lastWorkoutDate.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff <= 1) {
    currentStreak = 1;
    
    // Count backwards to find current streak
    for (let i = sortedLogs.length - 2; i >= 0; i--) {
      const currentDate = new Date(sortedLogs[i + 1].date);
      const prevDate = new Date(sortedLogs[i].date);
      currentDate.setHours(0, 0, 0, 0);
      prevDate.setHours(0, 0, 0, 0);
      
      const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < sortedLogs.length; i++) {
    const currentDate = new Date(sortedLogs[i].date);
    const prevDate = new Date(sortedLogs[i - 1].date);
    currentDate.setHours(0, 0, 0, 0);
    prevDate.setHours(0, 0, 0, 0);
    
    const diff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}

function calculateWeeklyProgress(sortedLogs: WorkoutLog[]): Array<{ week: string; count: number }> {
  const weeks = new Map<string, number>();
  const now = new Date();
  
  // Generate last 12 weeks
  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (now.getDay() + 7 * i));
    weekStart.setHours(0, 0, 0, 0);
    
    const weekKey = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    weeks.set(weekKey, 0);
  }

  sortedLogs.forEach(log => {
    const logDate = new Date(log.date);
    const weekStart = new Date(logDate);
    weekStart.setDate(logDate.getDate() - logDate.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekKey = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`;
    if (weeks.has(weekKey)) {
      weeks.set(weekKey, (weeks.get(weekKey) || 0) + 1);
    }
  });

  return Array.from(weeks.entries()).map(([week, count]) => ({ week, count }));
}

function calculateMonthlyProgress(sortedLogs: WorkoutLog[]): Array<{ month: string; count: number; duration: number }> {
  const months = new Map<string, { count: number; duration: number }>();
  const now = new Date();
  
  // Generate last 12 months
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = monthDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    months.set(monthKey, { count: 0, duration: 0 });
  }

  sortedLogs.forEach(log => {
    const logDate = new Date(log.date);
    const monthKey = logDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    if (months.has(monthKey)) {
      const current = months.get(monthKey)!;
      months.set(monthKey, {
        count: current.count + 1,
        duration: current.duration + log.duration
      });
    }
  });

  return Array.from(months.entries()).map(([month, data]) => ({
    month,
    count: data.count,
    duration: data.duration
  }));
}

function calculateFeelingTrend(sortedLogs: WorkoutLog[]): Array<{ date: string; feeling: number }> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return sortedLogs
    .filter(log => log.date >= thirtyDaysAgo && log.feeling !== undefined)
    .map(log => ({
      date: log.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      feeling: log.feeling!
    }));
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}
