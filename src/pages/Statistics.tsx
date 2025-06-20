import React from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateWorkoutStats, formatDuration } from '../utils/statistics';
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  Award, 
  Target, 
  Activity,
  BarChart3,
  Heart
} from 'lucide-react';

const Statistics: React.FC = () => {
  const { workoutLogs, workouts, exercises } = useAppContext();
  
  const stats = calculateWorkoutStats(workoutLogs, workouts, exercises);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, subtitle, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your Fitness Journey
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your progress and celebrate your achievements
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          icon={<Activity size={20} />}
          color="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
        />
        
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak} days`}
          icon={<Award size={20} />}
          color="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
        />
        
        <StatCard
          title="Total Time"
          value={formatDuration(stats.totalDuration)}
          icon={<Clock size={20} />}
          color="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
        />
        
        <StatCard
          title="Avg Duration"
          value={formatDuration(Math.round(stats.averageDuration))}
          icon={<TrendingUp size={20} />}
          color="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Target className="text-orange-500 mr-2" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Longest Streak</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.longestStreak} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Favorite Workout Type</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.favoriteWorkoutType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">This Month</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats.monthlyProgress[stats.monthlyProgress.length - 1]?.count || 0} workouts
              </span>
            </div>
          </div>
        </div>

        {/* Most Used Exercises */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center mb-4">
            <BarChart3 className="text-blue-500 mr-2" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Exercises</h2>
          </div>
          <div className="space-y-3">
            {stats.mostUsedExercises.slice(0, 5).map((exercise, index) => (
              <div key={exercise.exerciseId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {exercise.name}
                  </span>
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-sm">
                  {exercise.count} times
                </span>
              </div>
            ))}
            {stats.mostUsedExercises.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No exercise data yet. Start logging workouts!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Calendar className="text-green-500 mr-2" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Progress</h2>
          </div>
          <div className="space-y-2">
            {stats.weeklyProgress.slice(-8).map((week, index) => (
              <div key={week.week} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Week of {week.week}
                </span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((week.count / 7) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white w-8">
                    {week.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feeling Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center mb-4">
            <Heart className="text-red-500 mr-2" size={20} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">How You've Been Feeling</h2>
          </div>
          <div className="space-y-2">
            {stats.feelingTrend.slice(-10).map((entry, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {entry.date}
                </span>
                <div className="flex items-center">
                  <div className="flex space-x-1 mr-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-3 h-3 rounded-full ${
                          star <= entry.feeling
                            ? 'bg-red-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {entry.feeling}/5
                  </span>
                </div>
              </div>
            ))}
            {stats.feelingTrend.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Start rating your workouts to see trends!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      {stats.totalWorkouts > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
          <h3 className="text-xl font-bold mb-2">Keep Going Strong! 💪</h3>
          <p className="text-blue-100">
            You've completed {stats.totalWorkouts} workouts and spent {formatDuration(stats.totalDuration)} training. 
            {stats.currentStreak > 0 && ` You're on a ${stats.currentStreak}-day streak!`}
          </p>
        </div>
      )}
    </div>
  );
};

export default Statistics;
