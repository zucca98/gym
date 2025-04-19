import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Exercise, Workout, WorkoutLog, UserProfile, TimerSettings } from '../types';
import { sampleExercises } from '../data/exercises';
import { sampleWorkouts } from '../data/workouts';

interface AppContextType {
  // State
  exercises: Exercise[];
  workouts: Workout[];
  workoutLogs: WorkoutLog[];
  userProfile: UserProfile | null;
  darkMode: boolean;
  timerSettings: TimerSettings;
  // Exercise Functions
  addExercise: (exercise: Exercise) => void;
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  toggleFavorite: (id: string) => void;
  // Workout Functions
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  // WorkoutLog Functions
  addWorkoutLog: (log: WorkoutLog) => void;
  updateWorkoutLog: (log: WorkoutLog) => void;
  deleteWorkoutLog: (id: string) => void;
  // User Profile Functions
  updateUserProfile: (profile: UserProfile) => void;
  // Theme Functions
  toggleDarkMode: () => void;
  // Timer Functions
  updateTimerSettings: (settings: TimerSettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

const defaultUserProfile: UserProfile = {
  id: 'user1',
  name: 'CrossFit Athlete',
  personalRecords: [],
  goals: []
};

const defaultTimerSettings: TimerSettings = {
  type: 'Countdown',
  duration: 180
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [exercises, setExercises] = useState<Exercise[]>(sampleExercises);
  const [workouts, setWorkouts] = useState<Workout[]>(sampleWorkouts);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(defaultUserProfile);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [timerSettings, setTimerSettings] = useState<TimerSettings>(defaultTimerSettings);

  useEffect(() => {
    // Apply dark mode to body element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Exercise Functions
  const addExercise = (exercise: Exercise) => {
    setExercises((prev) => [...prev, exercise]);
  };

  const updateExercise = (exercise: Exercise) => {
    setExercises((prev) => prev.map((ex) => (ex.id === exercise.id ? exercise : ex)));
  };

  const deleteExercise = (id: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, isFavorite: !ex.isFavorite } : ex))
    );
  };

  // Workout Functions
  const addWorkout = (workout: Workout) => {
    setWorkouts((prev) => [...prev, workout]);
  };

  const updateWorkout = (workout: Workout) => {
    setWorkouts((prev) => prev.map((w) => (w.id === workout.id ? workout : w)));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  // WorkoutLog Functions
  const addWorkoutLog = (log: WorkoutLog) => {
    setWorkoutLogs((prev) => [...prev, log]);
  };

  const updateWorkoutLog = (log: WorkoutLog) => {
    setWorkoutLogs((prev) => prev.map((l) => (l.id === log.id ? log : l)));
  };

  const deleteWorkoutLog = (id: string) => {
    setWorkoutLogs((prev) => prev.filter((l) => l.id !== id));
  };

  // User Profile Functions
  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  // Theme Functions
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Timer Functions
  const updateTimerSettings = (settings: TimerSettings) => {
    setTimerSettings(settings);
  };

  return (
    <AppContext.Provider
      value={{
        exercises,
        workouts,
        workoutLogs,
        userProfile,
        darkMode,
        timerSettings,
        addExercise,
        updateExercise,
        deleteExercise,
        toggleFavorite,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addWorkoutLog,
        updateWorkoutLog,
        deleteWorkoutLog,
        updateUserProfile,
        toggleDarkMode,
        updateTimerSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};