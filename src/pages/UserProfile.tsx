import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Trophy, Target, Trash2, Plus, Save, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { PersonalRecord, Goal } from '../types';

const UserProfile: React.FC = () => {
  const { userProfile, exercises, updateUserProfile } = useAppContext();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [weight, setWeight] = useState(userProfile?.weight?.toString() || '');
  const [height, setHeight] = useState(userProfile?.height?.toString() || '');
  
  const [isAddingPR, setIsAddingPR] = useState(false);
  const [newPR, setNewPR] = useState<Partial<PersonalRecord>>({
    id: uuidv4(),
    date: new Date(),
  });
  
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    id: uuidv4(),
    completed: false,
  });
  
  if (!userProfile) {
    return <div>Loading user profile...</div>;
  }
  
  const saveProfile = () => {
    if (!userProfile) return;
    
    updateUserProfile({
      ...userProfile,
      name,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
    });
    
    setIsEditingProfile(false);
  };
  
  const handleAddPR = () => {
    if (!newPR.exerciseId || !newPR.value || !newPR.unit) {
      alert('Please fill in all required fields');
      return;
    }
    
    const fullPR: PersonalRecord = {
      id: newPR.id || uuidv4(),
      exerciseId: newPR.exerciseId,
      value: newPR.value,
      unit: newPR.unit,
      date: newPR.date || new Date(),
    };
    
    updateUserProfile({
      ...userProfile,
      personalRecords: [...userProfile.personalRecords, fullPR],
    });
    
    setNewPR({
      id: uuidv4(),
      date: new Date(),
    });
    setIsAddingPR(false);
  };
  
  const handleAddGoal = () => {
    if (!newGoal.description || !newGoal.target || !newGoal.unit) {
      alert('Please fill in all required fields');
      return;
    }
    
    const fullGoal: Goal = {
      id: newGoal.id || uuidv4(),
      description: newGoal.description,
      target: newGoal.target,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      completed: false,
    };
    
    updateUserProfile({
      ...userProfile,
      goals: [...userProfile.goals, fullGoal],
    });
    
    setNewGoal({
      id: uuidv4(),
      completed: false,
    });
    setIsAddingGoal(false);
  };
  
  const toggleGoalCompletion = (id: string) => {
    const updatedGoals = userProfile.goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    );
    
    updateUserProfile({
      ...userProfile,
      goals: updatedGoals,
    });
  };
  
  const deleteGoal = (id: string) => {
    const updatedGoals = userProfile.goals.filter(goal => goal.id !== id);
    
    updateUserProfile({
      ...userProfile,
      goals: updatedGoals,
    });
  };
  
  const deletePR = (id: string) => {
    const updatedPRs = userProfile.personalRecords.filter(pr => pr.id !== id);
    
    updateUserProfile({
      ...userProfile,
      personalRecords: updatedPRs,
    });
  };
  
  const getExerciseName = (id: string) => {
    const exercise = exercises.find(ex => ex.id === id);
    return exercise ? exercise.name : 'Unknown Exercise';
  };
  
  return (
    <div className="py-6 pb-24">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
              <User size={32} className="text-blue-600 dark:text-blue-300" />
            </div>
            {isEditingProfile ? (
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="font-bold text-xl text-gray-900 dark:text-white bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 mb-1 p-0"
                  placeholder="Your Name"
                />
              </div>
            ) : (
              <div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">{userProfile.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">CrossFit Athlete</p>
              </div>
            )}
          </div>
          {isEditingProfile ? (
            <button
              onClick={saveProfile}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center"
            >
              <Save size={16} className="mr-1" />
              Save
            </button>
          ) : (
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-lg text-sm"
            >
              Edit
            </button>
          )}
        </div>
        
        {isEditingProfile ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight in lbs"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Height (in)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height in inches"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Weight</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {userProfile.weight ? `${userProfile.weight} lbs` : 'Not set'}
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Height</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {userProfile.height ? `${userProfile.height} in` : 'Not set'}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Personal Records */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Trophy size={20} className="text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Records</h2>
          </div>
          <button
            onClick={() => setIsAddingPR(true)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add PR
          </button>
        </div>
        
        {userProfile.personalRecords.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {userProfile.personalRecords.map(pr => (
              <div key={pr.id} className="py-3 flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{getExerciseName(pr.exerciseId)}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-900 dark:text-white mr-3">
                    {pr.value} {pr.unit}
                  </p>
                  <button
                    onClick={() => deletePR(pr.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No personal records yet</p>
            <button
              onClick={() => setIsAddingPR(true)}
              className="text-blue-600 dark:text-blue-400 font-medium mt-2"
            >
              Add your first PR
            </button>
          </div>
        )}
      </div>
      
      {/* Goals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Target size={20} className="text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Goals</h2>
          </div>
          <button
            onClick={() => setIsAddingGoal(true)}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center text-sm"
          >
            <Plus size={16} className="mr-1" />
            Add Goal
          </button>
        </div>
        
        {userProfile.goals.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {userProfile.goals.map(goal => (
              <div key={goal.id} className="py-3 flex items-center">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => toggleGoalCompletion(goal.id)}
                  className="w-5 h-5 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 mr-3"
                />
                <div className="flex-1">
                  <h3 className={`font-medium ${goal.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                    {goal.description}
                  </h3>
                  <div className="flex items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Target: {goal.target} {goal.unit}
                    </p>
                    {goal.deadline && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                        By: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No goals set yet</p>
            <button
              onClick={() => setIsAddingGoal(true)}
              className="text-blue-600 dark:text-blue-400 font-medium mt-2"
            >
              Set your first goal
            </button>
          </div>
        )}
      </div>
      
      {/* Add PR Modal */}
      {isAddingPR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Personal Record</h3>
              <button
                onClick={() => setIsAddingPR(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Exercise
                </label>
                <select
                  value={newPR.exerciseId || ''}
                  onChange={(e) => setNewPR({ ...newPR, exerciseId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                >
                  <option value="">Select an exercise</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>{ex.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Value
                  </label>
                  <input
                    type="number"
                    value={newPR.value || ''}
                    onChange={(e) => setNewPR({ ...newPR, value: parseFloat(e.target.value) })}
                    placeholder="e.g., 225"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newPR.unit || ''}
                    onChange={(e) => setNewPR({ ...newPR, unit: e.target.value })}
                    placeholder="e.g., lbs, reps"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={newPR.date ? new Date(newPR.date).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewPR({ ...newPR, date: new Date(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleAddPR}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg"
              >
                Add Personal Record
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Goal</h3>
              <button
                onClick={() => setIsAddingGoal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newGoal.description || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="e.g., Do 10 consecutive pull-ups"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target
                  </label>
                  <input
                    type="number"
                    value={newGoal.target || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) })}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={newGoal.unit || ''}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    placeholder="e.g., reps, lbs"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={newGoal.deadline ? new Date(newGoal.deadline).toISOString().split('T')[0] : ''}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value ? new Date(e.target.value) : undefined })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleAddGoal}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg"
              >
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;