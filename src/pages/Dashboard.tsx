import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Play, Clock, Dumbbell, Calendar, Award } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { workouts, workoutLogs, exercises, userProfile } = useAppContext();
  const navigate = useNavigate();

  // Get recent workout logs
  const recentLogs = [...workoutLogs]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);

  // Get favorite exercises
  const favoriteExercises = exercises.filter((ex) => ex.isFavorite).slice(0, 4);

  // Calculate streak (consecutive days with workouts)
  const calculateStreak = () => {
    if (workoutLogs.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort logs by date
    const sortedDates = [...workoutLogs]
      .map(log => {
        const date = new Date(log.date);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .sort((a, b) => b - a);
    
    // Remove duplicates (multiple workouts on same day)
    const uniqueDates = [...new Set(sortedDates)];
    
    let streak = 0;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if workout today or yesterday to continue streak
    const hasRecentWorkout = uniqueDates[0] === today.getTime() || 
                            uniqueDates[0] === yesterday.getTime();
                            
    if (!hasRecentWorkout) return 0;
    
    // Count consecutive days
    for (let i = 0; i < uniqueDates.length; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      
      if (currentDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  return (
    <div className="py-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {userProfile?.name || 'Athlete'}!
        </h2>
        <p className="text-blue-100 mb-6">Ready for today's workout?</p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/builder')}
            className="bg-white text-blue-700 font-semibold py-3 px-6 rounded-lg flex items-center transition transform hover:scale-105"
          >
            <Play size={18} className="mr-2" />
            Start Workout
          </button>
          <button
            onClick={() => navigate('/timer')}
            className="bg-blue-800 bg-opacity-50 text-white font-semibold py-3 px-6 rounded-lg flex items-center transition transform hover:scale-105"
          >
            <Clock size={18} className="mr-2" />
            Quick Timer
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Workout Streak</h3>
            <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 p-1.5 rounded-lg">
              <Award size={16} />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{calculateStreak()} days</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">Total Workouts</h3>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 p-1.5 rounded-lg">
              <Calendar size={16} />
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{workoutLogs.length}</p>
        </div>
      </div>

      {/* Quick-Start Workouts */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick-Start Workouts</h2>
          <button 
            onClick={() => navigate('/builder')}
            className="text-blue-600 dark:text-blue-400 text-sm font-semibold"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {workouts.slice(0, 3).map((workout) => (
            <div 
              key={workout.id}
              onClick={() => navigate(`/workouts/${workout.id}`)}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{workout.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{workout.type} • {workout.exercises.length} exercises</p>
                </div>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 p-2 rounded-lg">
                  <Dumbbell size={18} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Favorite Exercises */}
      {favoriteExercises.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Favorite Exercises</h2>
            <button 
              onClick={() => navigate('/exercises')}
              className="text-blue-600 dark:text-blue-400 text-sm font-semibold"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {favoriteExercises.map((exercise) => (
              <div 
                key={exercise.id}
                onClick={() => navigate(`/exercises/${exercise.id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
              >
                <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">{exercise.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{exercise.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;