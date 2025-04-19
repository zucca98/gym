import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Share2, Play, Pencil, Trash2, Dumbbell, Clock, Trophy } from 'lucide-react';

const WorkoutDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { workouts, exercises, updateWorkout, deleteWorkout, updateTimerSettings } = useAppContext();
  const navigate = useNavigate();
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const workout = workouts.find(w => w.id === id);
  
  if (!workout) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">Workout not found</p>
          <button
            onClick={() => navigate('/builder')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Create a Workout
          </button>
        </div>
      </div>
    );
  }
  
  const getExerciseName = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    return exercise ? exercise.name : 'Unknown Exercise';
  };
  
  const formatWorkoutType = () => {
    if (workout.type === 'AMRAP') {
      return `AMRAP ${workout.rounds} min`;
    } else if (workout.type === 'For Time') {
      return `For Time${workout.timeCap ? ` (${Math.floor(workout.timeCap / 60)} min cap)` : ''}`;
    } else if (workout.type === 'EMOM') {
      return `EMOM ${workout.rounds} min`;
    } else {
      return workout.type;
    }
  };
  
  const handleStartWorkout = () => {
    // Configure timer settings based on workout type
    if (workout.type === 'AMRAP') {
      updateTimerSettings({
        type: 'AMRAP',
        duration: (workout.rounds || 0) * 60,
      });
    } else if (workout.type === 'For Time') {
      updateTimerSettings({
        type: 'Countdown',
        duration: workout.timeCap || 20 * 60, // Default 20 min if not specified
      });
    } else if (workout.type === 'EMOM') {
      updateTimerSettings({
        type: 'EMOM',
        rounds: workout.rounds || 10,
        workTime: 50, // 50 seconds work, 10 seconds rest
        restTime: 10,
      });
    } else if (workout.type === 'Tabata') {
      updateTimerSettings({
        type: 'Tabata',
        rounds: 8, // Standard Tabata is 8 rounds
        workTime: 20, // 20 seconds work
        restTime: 10, // 10 seconds rest
      });
    } else {
      updateTimerSettings({
        type: 'Stopwatch',
      });
    }
    
    navigate('/timer', { state: { workoutId: workout.id } });
  };
  
  const handleDeleteWorkout = () => {
    deleteWorkout(workout.id);
    navigate('/');
  };
  
  return (
    <div className="py-6 pb-20">
      {/* Header with back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        
        <div className="flex space-x-3">
          <button className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
            <Share2 size={18} />
          </button>
          <button 
            onClick={() => navigate(`/builder`, { state: { workoutId: workout.id } })}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-red-600"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      {/* Workout Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <div className="mb-3">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
            {formatWorkoutType()}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{workout.name}</h1>
        {workout.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">{workout.description}</p>
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Dumbbell size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                {workout.exercises.length} Exercise{workout.exercises.length !== 1 ? 's' : ''}
              </span>
            </div>
            {workout.rounds && (
              <div className="flex items-center">
                <Clock size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {workout.rounds} min
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Exercise List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exercises</h2>
        
        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => {
            const exerciseName = getExerciseName(exercise.exerciseId);
            return (
              <div key={exercise.id} className="flex items-center">
                <div className="bg-gray-100 dark:bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">{exerciseName}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {exercise.reps && <span>{exercise.reps} reps</span>}
                    {exercise.weight && <span> • {exercise.weight} lbs</span>}
                    {exercise.distance && <span> • {exercise.distance} meters</span>}
                    {exercise.duration && <span> • {exercise.duration} secs</span>}
                    {!exercise.reps && !exercise.weight && !exercise.distance && !exercise.duration && 
                      <span>Complete as prescribed</span>
                    }
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Personal Records */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Records</h2>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View History</button>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="flex justify-center mb-2">
              <Trophy size={24} className="text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">No records yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Complete this workout to set your first record</p>
          </div>
        </div>
      </div>
      
      {/* Start Workout Button */}
      <div className="fixed bottom-20 left-4 right-4">
        <button 
          onClick={handleStartWorkout}
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center"
        >
          <Play size={20} className="mr-2" />
          Start Workout
        </button>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Delete Workout?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-5">
              Are you sure you want to delete "{workout.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteWorkout}
                className="flex-1 bg-red-600 text-white font-medium py-3 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;