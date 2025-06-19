import React, { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ExerciseLibrary = lazy(() => import('./pages/ExerciseLibrary'));
const WorkoutBuilder = lazy(() => import('./pages/WorkoutBuilder'));
const WorkoutDiary = lazy(() => import('./pages/WorkoutDiary'));
const Timer = lazy(() => import('./pages/Timer'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const ExerciseDetail = lazy(() => import('./pages/ExerciseDetail'));
const WorkoutDetail = lazy(() => import('./pages/WorkoutDetail'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/exercises/:id" element={<ExerciseDetail />} />
            <Route path="/builder" element={<WorkoutBuilder />} />
            <Route path="/workouts/:id" element={<WorkoutDetail />} />
            <Route path="/diary" element={<WorkoutDiary />} />
            <Route path="/timer" element={<Timer />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
