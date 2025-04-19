export type ExerciseCategory = 'Bodyweight' | 'Weightlifting' | 'Gymnastics' | 'Cardio' | 'Strongman';

export type Equipment = 'None' | 'Barbell' | 'Dumbbell' | 'Kettlebell' | 'Jump Rope' | 'Pull-up Bar' | 'Rings' | 'Rower' | 'Bike' | 'Box' | 'Wall Ball' | 'Medicine Ball' | 'Sled' | 'Rope';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
  category: ExerciseCategory;
  equipment: Equipment[];
  difficulty: DifficultyLevel;
  muscles: string[];
  variants: ExerciseVariant[];
  isFavorite: boolean;
}

export interface ExerciseVariant {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
}

export type WorkoutType = 'AMRAP' | 'For Time' | 'EMOM' | 'Tabata' | 'Chipper' | 'Custom';

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  type: WorkoutType;
  rounds?: number;
  timeCap?: number; // in seconds
  exercises: WorkoutExercise[];
  restBetweenRounds?: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
  isTemplate: boolean;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  date: Date;
  duration: number; // in seconds
  notes?: string;
  feeling?: number; // 1-10 scale
  exerciseResults: ExerciseResult[];
  photoUrl?: string;
}

export interface ExerciseResult {
  id: string;
  exerciseId: string;
  reps?: number;
  weight?: number;
  distance?: number;
  duration?: number;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  weight?: number;
  height?: number;
  personalRecords: PersonalRecord[];
  goals: Goal[];
}

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  value: number;
  unit: string;
  date: Date;
}

export interface Goal {
  id: string;
  description: string;
  target: number;
  unit: string;
  deadline?: Date;
  completed: boolean;
}

export type TimerType = 'Countdown' | 'Stopwatch' | 'AMRAP' | 'EMOM' | 'Tabata';

export interface TimerSettings {
  type: TimerType;
  duration?: number; // in seconds
  rounds?: number;
  workTime?: number; // in seconds (for Tabata)
  restTime?: number; // in seconds (for Tabata, EMOM)
}