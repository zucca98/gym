import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Calendar, BarChart2, ChevronRight, Clock, Dumbbell, X } from 'lucide-react';

const WorkoutDiary: React.FC = () => {
  const { workoutLogs, workouts, deleteWorkoutLog } = useAppContext();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Sort logs by date (newest first)
  const sortedLogs = [...workoutLogs].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get workout name by ID
  const getWorkoutName = (workoutId: string) => {
    const workout = workouts.find(w => w.id === workoutId);
    return workout ? workout.name : 'Unknown Workout';
  };
  
  // Format duration from seconds to mm:ss or hh:mm:ss
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
  };
  
  // Format date to readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Group logs by week for calendar view
  const getWeekNumber = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    const yearStart = new Date(d.getFullYear(), 0, 1);
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };
  
  const getWeekString = (date: Date) => {
    const d = new Date(date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const formatWeekDay = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    return `${formatWeekDay(weekStart)} - ${formatWeekDay(weekEnd)}`;
  };
  
  const groupLogsByWeek = () => {
    const grouped: { [key: string]: any[] } = {};
    
    sortedLogs.forEach(log => {
      const date = new Date(log.date);
      const year = date.getFullYear();
      const week = getWeekNumber(date);
      const key = `${year}-${week}`;
      
      if (!grouped[key]) {
        grouped[key] = [];
      }
      
      grouped[key].push(log);
    });
    
    return Object.keys(grouped).map(key => ({
      weekKey: key,
      weekString: getWeekString(new Date(grouped[key][0].date)),
      logs: grouped[key]
    }));
  };
  
  const logsByWeek = groupLogsByWeek();
  
  // Delete a workout log
  const handleDeleteLog = (id: string) => {
    deleteWorkoutLog(id);
    setShowDeleteConfirm(null);
  };
  
  return (
    <div className="py-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workout Diary</h1>
        <div className="flex p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <BarChart2 size={18} />
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md text-sm ${
              viewMode === 'calendar'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow'
                : 'text-gray-600 dark:text-gray-300'
            }`}
          >
            <Calendar size={18} />
          </button>
        </div>
      </div>
      
      {workoutLogs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <Dumbbell size={24} className="text-gray-500 dark:text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No workouts logged yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Track your workouts to see your progress over time</p>
          <button
            onClick={() => navigate('/builder')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Create Your First Workout
          </button>
        </div>
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="space-y-5">
              {sortedLogs.map(log => (
                <div 
                  key={log.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md relative"
                >
                  <button
                    onClick={() => setShowDeleteConfirm(log.id)}
                    className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <X size={18} />
                  </button>
                  
                  <div className="flex items-start mb-3">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4 shrink-0">
                      <Dumbbell size={20} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {getWorkoutName(log.workoutId)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(log.date)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                      <div className="flex items-center">
                        <Clock size={16} className="text-gray-600 dark:text-gray-300 mr-1" />
                        <p className="font-medium text-gray-900 dark:text-white">{formatDuration(log.duration)}</p>
                      </div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Feeling</p>
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-1 ${
                            log.feeling && log.feeling > 7 ? 'bg-green-500' : 
                            log.feeling && log.feeling > 4 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        ></div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {log.feeling ? `${log.feeling}/10` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {log.notes && (
                    <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {logsByWeek.map(week => (
                <div key={week.weekKey}>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{week.weekString}</h2>
                  <div className="space-y-1">
                    {week.logs.map(log => (
                      <div 
                        key={log.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3 shrink-0">
                            <Dumbbell size={16} className="text-blue-600 dark:text-blue-300" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{getWorkoutName(log.workoutId)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(log.date)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDuration(log.duration)}</p>
                            {log.feeling && (
                              <div className="flex items-center justify-end">
                                <div 
                                  className={`w-2 h-2 rounded-full mr-1 ${
                                    log.feeling > 7 ? 'bg-green-500' : 
                                    log.feeling > 4 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                ></div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{log.feeling}/10</p>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(log.id)}
                            className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Delete Log?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-5">
              Are you sure you want to delete this workout log? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLog(showDeleteConfirm)}
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

export default WorkoutDiary;