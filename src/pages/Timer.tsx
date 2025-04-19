import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Play, Pause, RotateCcw, ArrowLeft, Settings, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { WorkoutLog, TimerType } from '../types';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Timer: React.FC = () => {
  const { timerSettings, workouts, addWorkoutLog, updateTimerSettings } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const workoutId = location.state?.workoutId;
  const workout = workoutId ? workouts.find(w => w.id === workoutId) : null;
  
  const [time, setTime] = useState(timerSettings.duration || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempSettings, setTempSettings] = useState({...timerSettings});
  const [completed, setCompleted] = useState(false);
  const [notes, setNotes] = useState('');
  const [feeling, setFeeling] = useState<number>(7);
  
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/beep.mp3'); // Replace with actual sound file
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTime((prevTime) => {
          // Different behavior based on timer type
          if (timerSettings.type === 'Stopwatch') {
            return prevTime + 1;
          } else if (timerSettings.type === 'EMOM') {
            const newTime = prevTime - 1;
            const roundDuration = (timerSettings.workTime || 50) + (timerSettings.restTime || 10);
            const timeInCurrentRound = roundDuration - (newTime % roundDuration);
            
            // Transition between work and rest
            if (timeInCurrentRound === timerSettings.workTime) {
              // Transition to rest
              setIsResting(true);
              // Play sound
              if (audioRef.current) audioRef.current.play();
            } else if (timeInCurrentRound === roundDuration) {
              // New round starts
              setCurrentRound(prev => prev + 1);
              setIsResting(false);
              // Play sound
              if (audioRef.current) audioRef.current.play();
            }
            
            // Check if timer completed
            if (newTime <= 0) {
              clearInterval(intervalRef.current!);
              setIsRunning(false);
              setCompleted(true);
              return 0;
            }
            
            return newTime;
          } else if (timerSettings.type === 'Tabata') {
            const newTime = prevTime - 1;
            const roundDuration = (timerSettings.workTime || 20) + (timerSettings.restTime || 10);
            const timeInCurrentRound = roundDuration - (newTime % roundDuration);
            
            // Transition between work and rest
            if (timeInCurrentRound === timerSettings.workTime) {
              // Transition to rest
              setIsResting(true);
              // Play sound
              if (audioRef.current) audioRef.current.play();
            } else if (timeInCurrentRound === roundDuration) {
              // New round starts
              setCurrentRound(prev => {
                const newRound = prev + 1;
                if (newRound > (timerSettings.rounds || 8)) {
                  clearInterval(intervalRef.current!);
                  setIsRunning(false);
                  setCompleted(true);
                  return prev;
                }
                return newRound;
              });
              setIsResting(false);
              // Play sound
              if (audioRef.current) audioRef.current.play();
            }
            
            // Check if timer completed
            if (newTime <= 0) {
              clearInterval(intervalRef.current!);
              setIsRunning(false);
              setCompleted(true);
              return 0;
            }
            
            return newTime;
          } else {
            // Countdown, AMRAP
            const newTime = prevTime - 1;
            if (newTime <= 0) {
              clearInterval(intervalRef.current!);
              setIsRunning(false);
              setCompleted(true);
              return 0;
            }
            return newTime;
          }
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerSettings]);
  
  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(timerSettings.duration || 0);
    setCurrentRound(1);
    setIsResting(false);
    setCompleted(false);
  };
  
  const saveSettings = () => {
    updateTimerSettings(tempSettings);
    setTime(tempSettings.duration || 0);
    setCurrentRound(1);
    setIsResting(false);
    setCompleted(false);
    setShowSettings(false);
  };
  
  const saveWorkoutResult = () => {
    if (workout) {
      const workoutLog: WorkoutLog = {
        id: uuidv4(),
        workoutId: workout.id,
        date: new Date(),
        duration: timerSettings.type === 'Stopwatch' ? time : (timerSettings.duration || 0) - time,
        notes,
        feeling,
        exerciseResults: [],
      };
      
      addWorkoutLog(workoutLog);
      navigate('/diary');
    } else {
      // Just go back if there's no workout to log
      navigate(-1);
    }
  };
  
  // Get the background color based on timer state
  const getBackgroundColor = () => {
    if (completed) {
      return 'bg-green-600';
    } else if (isResting) {
      return 'bg-blue-600';
    } else {
      return 'bg-gray-900';
    }
  };
  
  // Get the text to display above the timer
  const getTimerStateText = () => {
    if (completed) {
      return 'Completed!';
    } else if (isResting) {
      return 'REST';
    } else {
      switch (timerSettings.type) {
        case 'AMRAP':
          return 'AMRAP';
        case 'EMOM':
          return 'WORK';
        case 'Tabata':
          return 'WORK';
        default:
          return workout ? workout.name : 'Timer';
      }
    }
  };
  
  return (
    <div className={`fixed inset-0 ${getBackgroundColor()} flex flex-col text-white z-50 transition-colors duration-300`}>
      {/* Header */}
      <div className="px-4 py-6 flex justify-between items-center">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold">
          {timerSettings.type}
          {timerSettings.type === 'EMOM' && timerSettings.rounds && ` ${timerSettings.rounds}'`}
          {timerSettings.type === 'Tabata' && timerSettings.rounds && ` (${timerSettings.rounds} rounds)`}
        </h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <Settings size={24} />
        </button>
      </div>
      
      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {(timerSettings.type === 'EMOM' || timerSettings.type === 'Tabata') && (
          <div className="mb-8 text-xl font-semibold">
            Round {currentRound}/{timerSettings.rounds}
          </div>
        )}
        
        <div className="mb-2 text-2xl">
          {getTimerStateText()}
        </div>
        
        <div className="text-7xl font-bold mb-16 tabular-nums">
          {formatTime(time)}
        </div>
        
        {/* Controls */}
        <div className="flex space-x-8 mb-16">
          <button 
            onClick={handleReset}
            className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <RotateCcw size={30} />
          </button>
          
          <button 
            onClick={handleStartPause}
            className="w-20 h-20 rounded-full bg-white flex items-center justify-center hover:bg-white/90 transition-colors"
          >
            {isRunning ? (
              <Pause size={40} className="text-gray-900" />
            ) : (
              <Play size={40} className="text-gray-900 ml-1" />
            )}
          </button>
        </div>
      </div>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Timer Settings</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Timer Type
              </label>
              <select
                value={tempSettings.type}
                onChange={(e) => setTempSettings(prev => ({ ...prev, type: e.target.value as TimerType }))}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              >
                <option value="Countdown">Countdown</option>
                <option value="Stopwatch">Stopwatch</option>
                <option value="AMRAP">AMRAP</option>
                <option value="EMOM">EMOM</option>
                <option value="Tabata">Tabata</option>
              </select>
            </div>
            
            {tempSettings.type !== 'Stopwatch' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  {tempSettings.type === 'AMRAP' || tempSettings.type === 'Countdown' ? 'Duration (seconds)' : 'Rounds'}
                </label>
                <input
                  type="number"
                  value={tempSettings.type === 'AMRAP' || tempSettings.type === 'Countdown' ? tempSettings.duration : tempSettings.rounds}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (tempSettings.type === 'AMRAP' || tempSettings.type === 'Countdown') {
                      setTempSettings(prev => ({ ...prev, duration: value }));
                    } else {
                      setTempSettings(prev => ({ ...prev, rounds: value }));
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
              </div>
            )}
            
            {(tempSettings.type === 'EMOM' || tempSettings.type === 'Tabata') && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Work Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={tempSettings.workTime}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, workTime: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Rest Time (seconds)
                  </label>
                  <input
                    type="number"
                    value={tempSettings.restTime}
                    onChange={(e) => setTempSettings(prev => ({ ...prev, restTime: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                </div>
              </>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-700 text-white font-medium py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Workout Complete Modal */}
      {completed && workout && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-md p-5">
            <h3 className="text-lg font-semibold text-white mb-2">Workout Complete!</h3>
            <p className="text-gray-300 mb-4">Great job on completing {workout.name}!</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did it go? Record any PRs or modifications..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
              ></textarea>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                How did you feel? (1-10)
              </label>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-gray-400">Terrible</span>
                <span className="text-xs text-gray-400">Great</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={feeling}
                onChange={(e) => setFeeling(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between">
                <span className="text-xs text-gray-400">1</span>
                <span className="text-xs text-gray-400">5</span>
                <span className="text-xs text-gray-400">10</span>
              </div>
            </div>
            
            <button
              onClick={saveWorkoutResult}
              className="w-full bg-green-600 text-white font-medium py-3 rounded-lg flex items-center justify-center"
            >
              <Save size={18} className="mr-2" />
              Save to Workout Diary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;