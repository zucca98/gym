import { create } from 'zustand';
import { Exercise, Workout, WorkoutLog, UserProfile, TimerSettings } from '../types';
import { sampleExercises } from '../data/exercises';
import { sampleWorkouts } from '../data/workouts';

interface AppState {
  exercises: Exercise[];
  workouts: Workout[];
  workoutLogs: WorkoutLog[];
  userProfile: UserProfile | null;
  darkMode: boolean;
  timerSettings: TimerSettings;
  addExercise: (exercise: Exercise) => void;
  updateExercise: (exercise: Exercise) => void;
  deleteExercise: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addWorkout: (workout: Workout) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  addWorkoutLog: (log: WorkoutLog) => void;
  updateWorkoutLog: (log: WorkoutLog) => void;
  deleteWorkoutLog: (id: string) => void;
  updateUserProfile: (profile: UserProfile) => void;
  toggleDarkMode: () => void;
  updateTimerSettings: (settings: TimerSettings) => void;
}

const defaultUserProfile: UserProfile = {
  id: 'user1',
  name: 'CrossFit Athlete',
  personalRecords: [],
  goals: [],
};

const defaultTimerSettings: TimerSettings = {
  type: 'Countdown',
  duration: 180,
};

export const useAppStore = create<AppState>((set) => ({
  exercises: sampleExercises,
  workouts: sampleWorkouts,
  workoutLogs: [],
  userProfile: defaultUserProfile,
  darkMode: false,
  timerSettings: defaultTimerSettings,
  addExercise: (exercise) => {
    set((state) => ({ exercises: [...state.exercises, exercise] }));
  },
  updateExercise: (exercise) => {
    set((state) => ({
      exercises: state.exercises.map((ex) => (ex.id === exercise.id ? exercise : ex)),
    }));
  },
  deleteExercise: (id) => {
    set((state) => ({ exercises: state.exercises.filter((ex) => ex.id !== id) }));
  },
  toggleFavorite: (id) => {
    set((state) => ({
      exercises: state.exercises.map((ex) =>
        ex.id === id ? { ...ex, isFavorite: !ex.isFavorite } : ex
      ),
    }));
  },
  addWorkout: (workout) => {
    set((state) => ({ workouts: [...state.workouts, workout] }));
  },
  updateWorkout: (workout) => {
    set((state) => ({
      workouts: state.workouts.map((w) => (w.id === workout.id ? workout : w)),
    }));
  },
  deleteWorkout: (id) => {
    set((state) => ({ workouts: state.workouts.filter((w) => w.id !== id) }));
  },
  addWorkoutLog: (log) => {
    set((state) => ({ workoutLogs: [...state.workoutLogs, log] }));
  },
  updateWorkoutLog: (log) => {
    set((state) => ({
      workoutLogs: state.workoutLogs.map((l) => (l.id === log.id ? log : l)),
    }));
  },
  deleteWorkoutLog: (id) => {
    set((state) => ({ workoutLogs: state.workoutLogs.filter((l) => l.id !== id) }));
  },
  updateUserProfile: (profile) => {
    set(() => ({ userProfile: profile }));
  },
  toggleDarkMode: () => {
    set((state) => {
      if (!state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: !state.darkMode };
    });
  },
  updateTimerSettings: (settings) => {
    set(() => ({ timerSettings: settings }));
  },
}));
