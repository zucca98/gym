import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Search, Filter, Heart, X } from 'lucide-react';
import { Exercise, ExerciseCategory, Equipment, DifficultyLevel } from '../types';

const ExerciseLibrary: React.FC = () => {
  const { exercises, toggleFavorite } = useAppContext();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(exercises);
  
  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<ExerciseCategory[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  // Categories, equipment and difficulty options
  const categories: ExerciseCategory[] = ['Bodyweight', 'Weightlifting', 'Gymnastics', 'Cardio', 'Strongman'];
  const equipmentOptions: Equipment[] = ['None', 'Barbell', 'Dumbbell', 'Kettlebell', 'Jump Rope', 'Pull-up Bar', 'Rings', 'Rower', 'Bike', 'Box'];
  const difficultyLevels: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
  
  // Apply filters when any filter state changes
  useEffect(() => {
    let results = [...exercises];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(ex => 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      results = results.filter(ex => selectedCategories.includes(ex.category));
    }
    
    // Apply equipment filter
    if (selectedEquipment.length > 0) {
      results = results.filter(ex => 
        ex.equipment.some(eq => selectedEquipment.includes(eq))
      );
    }
    
    // Apply difficulty filter
    if (selectedDifficulty.length > 0) {
      results = results.filter(ex => selectedDifficulty.includes(ex.difficulty));
    }
    
    // Apply favorites filter
    if (showFavoritesOnly) {
      results = results.filter(ex => ex.isFavorite);
    }
    
    setFilteredExercises(results);
  }, [exercises, searchTerm, selectedCategories, selectedEquipment, selectedDifficulty, showFavoritesOnly]);
  
  const handleCategoryToggle = (category: ExerciseCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const handleEquipmentToggle = (equipment: Equipment) => {
    if (selectedEquipment.includes(equipment)) {
      setSelectedEquipment(selectedEquipment.filter(e => e !== equipment));
    } else {
      setSelectedEquipment([...selectedEquipment, equipment]);
    }
  };
  
  const handleDifficultyToggle = (difficulty: DifficultyLevel) => {
    if (selectedDifficulty.includes(difficulty)) {
      setSelectedDifficulty(selectedDifficulty.filter(d => d !== difficulty));
    } else {
      setSelectedDifficulty([...selectedDifficulty, difficulty]);
    }
  };
  
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedEquipment([]);
    setSelectedDifficulty([]);
    setShowFavoritesOnly(false);
  };
  
  return (
    <div className="py-6">
      {/* Search and Filter Bar */}
      <div className="sticky top-16 bg-gray-100 dark:bg-gray-900 z-10 pb-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-sm transition-colors ${
              showFilters ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <Filter size={20} />
          </button>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md mb-4 animate-slideDown">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-sm text-blue-600 dark:text-blue-400"
              >
                Clear All
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                        selectedCategories.includes(category)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Equipment */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Equipment</h4>
                <div className="flex flex-wrap gap-2">
                  {equipmentOptions.slice(0, 6).map(equipment => (
                    <button
                      key={equipment}
                      onClick={() => handleEquipmentToggle(equipment)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                        selectedEquipment.includes(equipment)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {equipment}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Difficulty */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</h4>
                <div className="flex flex-wrap gap-2">
                  {difficultyLevels.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => handleDifficultyToggle(difficulty)}
                      className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                        selectedDifficulty.includes(difficulty)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Favorites */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFavoritesOnly}
                    onChange={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition ${showFavoritesOnly ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${showFavoritesOnly ? 'translate-x-5' : 'translate-x-1'} mt-1`}></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Favorites Only</span>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Filter Badges */}
        {(selectedCategories.length > 0 || selectedEquipment.length > 0 || selectedDifficulty.length > 0 || showFavoritesOnly) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map(category => (
              <div key={category} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-xs flex items-center">
                {category}
                <button onClick={() => handleCategoryToggle(category)} className="ml-1.5">
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {selectedEquipment.map(equipment => (
              <div key={equipment} className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-xs flex items-center">
                {equipment}
                <button onClick={() => handleEquipmentToggle(equipment)} className="ml-1.5">
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {selectedDifficulty.map(difficulty => (
              <div key={difficulty} className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-xs flex items-center">
                {difficulty}
                <button onClick={() => handleDifficultyToggle(difficulty)} className="ml-1.5">
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {showFavoritesOnly && (
              <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-xs flex items-center">
                Favorites
                <button onClick={() => setShowFavoritesOnly(false)} className="ml-1.5">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Exercise List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredExercises.length > 0 ? (
          filteredExercises.map(exercise => (
            <div 
              key={exercise.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex justify-between"
            >
              <div 
                className="flex-1 cursor-pointer"
                onClick={() => navigate(`/exercises/${exercise.id}`)}
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{exercise.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                    {exercise.category}
                  </span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded text-xs">
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{exercise.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(exercise.id);
                }}
                className="self-start p-2"
              >
                <Heart 
                  size={20} 
                  className={`transition-colors ${exercise.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500'}`} 
                />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No exercises match your filters.</p>
            <button
              onClick={clearAllFilters}
              className="mt-2 text-blue-600 dark:text-blue-400 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseLibrary;