import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Exercise, Workout, WorkoutLog, UserProfile, TimerSettings } from '../types';
import { sampleExercises } from '../data/exercises';
import { sampleWorkouts } from '../data/workouts';

// LocalStorage utility functions
const STORAGE_KEYS = {
  EXERCISES: 'crossfit-app-exercises',
  WORKOUTS: 'crossfit-app-workouts',
  WORKOUT_LOGS: 'crossfit-app-workout-logs',
  USER_PROFILE: 'crossfit-app-user-profile',
  DARK_MODE: 'crossfit-app-dark-mode',
  TIMER_SETTINGS: 'crossfit-app-timer-settings',
};

const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);

    // Handle Date objects in the data
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        ...item,
        ...(item.createdAt && { createdAt: new Date(item.createdAt) }),
        ...(item.updatedAt && { updatedAt: new Date(item.updatedAt) }),
        ...(item.date && { date: new Date(item.date) }),
        ...(item.deadline && { deadline: new Date(item.deadline) }),
      })) as T;
    } else if (parsed && typeof parsed === 'object') {
      return {
        ...parsed,
        ...(parsed.createdAt && { createdAt: new Date(parsed.createdAt) }),
        ...(parsed.updatedAt && { updatedAt: new Date(parsed.updatedAt) }),
        ...(parsed.date && { date: new Date(parsed.date) }),
        ...(parsed.deadline && { deadline: new Date(parsed.deadline) }),
      } as T;
    }

    return parsed;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

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
  // Initialize state with localStorage data or defaults
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const stored = loadFromStorage(STORAGE_KEYS.EXERCISES, null);
    return stored && stored.length > 0 ? stored : sampleExercises;
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const stored = loadFromStorage(STORAGE_KEYS.WORKOUTS, null);
    return stored && stored.length > 0 ? stored : sampleWorkouts;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() =>
    loadFromStorage(STORAGE_KEYS.WORKOUT_LOGS, [])
  );

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() =>
    loadFromStorage(STORAGE_KEYS.USER_PROFILE, defaultUserProfile)
  );

  const [darkMode, setDarkMode] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.DARK_MODE, false)
  );

  const [timerSettings, setTimerSettings] = useState<TimerSettings>(() =>
    loadFromStorage(STORAGE_KEYS.TIMER_SETTINGS, defaultTimerSettings)
  );

  // Save to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXERCISES, exercises);
  }, [exercises]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WORKOUTS, workouts);
  }, [workouts]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WORKOUT_LOGS, workoutLogs);
  }, [workoutLogs]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, userProfile);
  }, [userProfile]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DARK_MODE, darkMode);
  }, [darkMode]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TIMER_SETTINGS, timerSettings);
  }, [timerSettings]);

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