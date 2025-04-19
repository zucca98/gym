import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Plus, X, ArrowUp, ArrowDown, Save, Clock, RotateCcw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Workout, WorkoutType, WorkoutExercise, Exercise } from '../types';

interface WorkoutBuilderLocationState {
  exerciseId?: string;
}

const WorkoutBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as WorkoutBuilderLocationState | undefined;
  const { exercises, workouts, addWorkout } = useAppContext();
  
  const [workout, setWorkout] = useState<Partial<Workout>>({
    id: uuidv4(),
    name: '',
    type: 'AMRAP',
    exercises: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isTemplate: false
  });
  
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exercises);
  
  // If an exercise ID was passed in the location state, add it to the workout
  useEffect(() => {
    if (state?.exerciseId) {
      const exercise = exercises.find(ex => ex.id === state.exerciseId);
      if (exercise) {
        addExerciseToWorkout(exercise.id);
      }
    }
  }, [state?.exerciseId, exercises]);
  
  // Filter exercises based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredExercises(
        exercises.filter(ex =>
          ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ex.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchTerm, exercises]);
  
  const addExerciseToWorkout = (exerciseId: string) => {
    const newExercise: WorkoutExercise = {
      id: uuidv4(),
      exerciseId,
      reps: 10, // Default reps
    };
    
    setWorkout(prev => ({
      ...prev,
      exercises: [...(prev.exercises || []), newExercise]
    }));
    
    setShowExercisePicker(false);
    setSearchTerm('');
  };
  
  const removeExercise = (index: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index)
    }));
  };
  
  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (!workout.exercises) return;
    
    const newExercises = [...workout.exercises];
    if (direction === 'up' && index > 0) {
      [newExercises[index], newExercises[index - 1]] = [newExercises[index - 1], newExercises[index]];
    } else if (direction === 'down' && index < newExercises.length - 1) {
      [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
    }
    
    setWorkout(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };
  
  const updateExerciseDetail = (index: number, field: keyof WorkoutExercise, value: any) => {
    if (!workout.exercises) return;
    
    const newExercises = [...workout.exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    
    setWorkout(prev => ({
      ...prev,
      exercises: newExercises
    }));
  };
  
  const saveWorkout = () => {
    if (!workout.name) {
      alert('Please provide a workout name');
      return;
    }
    
    if (!workout.exercises || workout.exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }
    
    const newWorkout: Workout = {
      ...workout as Workout,
      updatedAt: new Date()
    };
    
    addWorkout(newWorkout);
    navigate(`/workouts/${newWorkout.id}`);
  };
  
  const getExerciseById = (id: string) => {
    return exercises.find(ex => ex.id === id);
  };
  
  return (
    <div className="py-6 pb-24">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create Workout</h1>
      
      {/* Workout Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <div className="mb-4">
          <label htmlFor="workout-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Workout Name
          </label>
          <input
            id="workout-name"
            type="text"
            value={workout.name || ''}
            onChange={(e) => setWorkout(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Monday Strength, EMOM Challenge"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="workout-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Workout Type
            </label>
            <select
              id="workout-type"
              value={workout.type}
              onChange={(e) => setWorkout(prev => ({ ...prev, type: e.target.value as WorkoutType }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
            >
              <option value="AMRAP">AMRAP</option>
              <option value="For Time">For Time</option>
              <option value="EMOM">EMOM</option>
              <option value="Tabata">Tabata</option>
              <option value="Chipper">Chipper</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          
          {(workout.type === 'AMRAP' || workout.type === 'EMOM' || workout.type === 'Tabata') && (
            <div>
              <label htmlFor="workout-rounds" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {workout.type === 'AMRAP' ? 'Time Cap (min)' : 'Rounds'}
              </label>
              <input
                id="workout-rounds"
                type="number"
                min="1"
                value={workout.rounds || ''}
                onChange={(e) => setWorkout(prev => ({ ...prev, rounds: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              />
            </div>
          )}
          
          {workout.type === 'For Time' && (
            <div>
              <label htmlFor="workout-time-cap" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Time Cap (min)
              </label>
              <input
                id="workout-time-cap"
                type="number"
                min="1"
                value={workout.timeCap ? Math.floor(workout.timeCap / 60) : ''}
                onChange={(e) => setWorkout(prev => ({ ...prev, timeCap: parseInt(e.target.value) * 60 }))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              />
            </div>
          )}
        </div>
        
        {/* Rest between rounds */}
        {(workout.type === 'AMRAP' || workout.type === 'EMOM') && (
          <div className="mb-4">
            <label htmlFor="rest-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rest Between Rounds (sec)
            </label>
            <input
              id="rest-time"
              type="number"
              min="0"
              value={workout.restBetweenRounds || ''}
              onChange={(e) => setWorkout(prev => ({ ...prev, restBetweenRounds: parseInt(e.target.value) }))}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
            />
          </div>
        )}
        
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (Optional)
          </label>
          <textarea
            value={workout.description || ''}
            onChange={(e) => setWorkout(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Add notes or instructions for this workout..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
          />
        </div>
      </div>
      
      {/* Exercise List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exercises</h2>
          <button
            onClick={() => setShowExercisePicker(true)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>
        
        {workout.exercises && workout.exercises.length > 0 ? (
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => {
              const exerciseData = getExerciseById(exercise.exerciseId);
              return (
                <div key={exercise.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{exerciseData?.name || 'Unknown Exercise'}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{exerciseData?.category}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => moveExercise(index, 'up')} 
                        disabled={index === 0}
                        className={`p-1.5 rounded ${index === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button 
                        onClick={() => moveExercise(index, 'down')} 
                        disabled={index === workout.exercises!.length - 1}
                        className={`p-1.5 rounded ${index === workout.exercises!.length - 1 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button 
                        onClick={() => removeExercise(index)}
                        className="p-1.5 text-red-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {workout.type !== 'AMRAP' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Reps
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={exercise.reps || ''}
                          onChange={(e) => updateExerciseDetail(index, 'reps', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                      </div>
                    )}
                    
                    {(exerciseData?.category === 'Weightlifting' || exerciseData?.category === 'Strongman') && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Weight (lbs)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={exercise.weight || ''}
                          onChange={(e) => updateExerciseDetail(index, 'weight', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                      </div>
                    )}
                    
                    {exerciseData?.category === 'Cardio' && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Distance (m)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={exercise.distance || ''}
                          onChange={(e) => updateExerciseDetail(index, 'distance', parseInt(e.target.value))}
                          className="w-full px-3 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">No exercises added yet</p>
            <button
              onClick={() => setShowExercisePicker(true)}
              className="text-blue-600 dark:text-blue-400 font-medium"
            >
              Add Your First Exercise
            </button>
          </div>
        )}
      </div>
      
      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Exercise</h3>
              <button 
                onClick={() => {
                  setShowExercisePicker(false);
                  setSearchTerm('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              />
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              {filteredExercises.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredExercises.map(exercise => (
                    <div 
                      key={exercise.id}
                      onClick={() => addExerciseToWorkout(exercise.id)}
                      className="py-3 flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 -mx-2 px-2 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{exercise.category}</p>
                      </div>
                      <Plus size={18} className="text-blue-600 dark:text-blue-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No exercises found</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom Action Bar */}
      <div className="fixed bottom-20 left-4 right-4 flex gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-4 rounded-xl flex items-center justify-center"
        >
          <RotateCcw size={20} className="mr-2" />
          Cancel
        </button>
        <button 
          onClick={saveWorkout}
          className="flex-1 bg-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center"
        >
          <Save size={20} className="mr-2" />
          Save Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutBuilder;