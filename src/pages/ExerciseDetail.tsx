import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Heart, Play, Share2, Dumbbell, BarChart3 } from 'lucide-react';

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { exercises, toggleFavorite } = useAppContext();
  const navigate = useNavigate();
  
  const exercise = exercises.find(ex => ex.id === id);
  
  if (!exercise) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">Exercise not found</p>
          <button
            onClick={() => navigate('/exercises')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Back to Exercise Library
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      {/* Back button and actions */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/exercises')}
          className="flex items-center text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Back</span>
        </button>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => {/* Share functionality */}}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400"
          >
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => toggleFavorite(exercise.id)}
            className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            <Heart 
              size={20} 
              className={`${exercise.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} 
            />
          </button>
        </div>
      </div>
      
      {/* Exercise header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{exercise.name}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
            {exercise.category}
          </span>
          <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
            {exercise.difficulty}
          </span>
        </div>
      </div>
      
      {/* Video Demo */}
      {exercise.videoUrl && (
        <div className="relative bg-gray-200 dark:bg-gray-700 rounded-xl mb-6 overflow-hidden aspect-video">
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="bg-blue-600 rounded-full p-4 text-white shadow-lg transform transition-transform hover:scale-110">
              <Play size={24} fill="white" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white font-medium">Watch demonstration video</p>
          </div>
        </div>
      )}
      
      {/* Exercise details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{exercise.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Equipment</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.equipment.map(eq => (
                <div key={eq} className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm">
                  <Dumbbell size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                  {eq}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Muscles</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.muscles.map(muscle => (
                <div key={muscle} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-sm">
                  {muscle}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Variations */}
      {exercise.variants.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Variations</h2>
          <div className="space-y-4">
            {exercise.variants.map(variant => (
              <div key={variant.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{variant.name}</h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded">
                      {variant.difficulty}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{variant.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Performance</h2>
          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">View All</button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 flex items-center justify-center">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <BarChart3 size={24} className="mr-2" />
            <p>No performance data yet</p>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="fixed bottom-20 left-4 right-4">
        <button 
          onClick={() => navigate('/builder', { state: { exerciseId: exercise.id } })}
          className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl shadow-lg flex items-center justify-center"
        >
          <Dumbbell size={20} className="mr-2" />
          Add to Workout
        </button>
      </div>
    </div>
  );
};

export default ExerciseDetail;