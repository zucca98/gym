import { Workout } from '../types';

export const sampleWorkouts: Workout[] = [
  {
    id: 'wod1',
    name: 'Cindy',
    description: 'A classic CrossFit benchmark workout.',
    type: 'AMRAP',
    rounds: 20, // 20 minutes
    exercises: [
      {
        id: 'cw1-ex1',
        exerciseId: 'ex1', // Pull-ups
        reps: 5,
      },
      {
        id: 'cw1-ex2',
        exerciseId: 'ex1', // Push-ups
        reps: 10,
      },
      {
        id: 'cw1-ex3',
        exerciseId: 'ex1', // Squats
        reps: 15,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isTemplate: true,
  },
  {
    id: 'wod2',
    name: 'Fran',
    description: 'Thrusters and pull-ups - a CrossFit classic.',
    type: 'For Time',
    exercises: [
      {
        id: 'fw1-ex1',
        exerciseId: 'ex2', // Thrusters
        reps: 21,
        weight: 95,
      },
      {
        id: 'fw1-ex2',
        exerciseId: 'ex3', // Pull-ups
        reps: 21,
      },
      {
        id: 'fw1-ex3',
        exerciseId: 'ex2', // Thrusters
        reps: 15,
        weight: 95,
      },
      {
        id: 'fw1-ex4',
        exerciseId: 'ex3', // Pull-ups
        reps: 15,
      },
      {
        id: 'fw1-ex5',
        exerciseId: 'ex2', // Thrusters
        reps: 9,
        weight: 95,
      },
      {
        id: 'fw1-ex6',
        exerciseId: 'ex3', // Pull-ups
        reps: 9,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    isTemplate: true,
  },
  {
    id: 'wod3',
    name: 'Fight Gone Bad',
    description: 'Three rounds of five exercises for one minute each.',
    type: 'AMRAP',
    rounds: 3,
    exercises: [
      {
        id: 'fgb-ex1',
        exerciseId: 'ex2', // Wall Ball
        reps: 0, // AMRAP for 1 minute
      },
      {
        id: 'fgb-ex2',
        exerciseId: 'ex4', // Sumo Deadlift High Pull
        reps: 0, // AMRAP for 1 minute
      },
      {
        id: 'fgb-ex3',
        exerciseId: 'ex6', // Box Jump
        reps: 0, // AMRAP for 1 minute
      },
      {
        id: 'fgb-ex4',
        exerciseId: 'ex2', // Push Press
        reps: 0, // AMRAP for 1 minute
      },
      {
        id: 'fgb-ex5',
        exerciseId: 'ex6', // Row
        reps: 0, // AMRAP for 1 minute
      },
    ],
    restBetweenRounds: 60, // 1 minute rest between rounds
    createdAt: new Date(),
    updatedAt: new Date(),
    isTemplate: true,
  },
];