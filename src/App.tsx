import React from 'react';
import { AppProvider } from './context/AppContext';
import Layout from './components/layout/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import ExerciseLibrary from './pages/ExerciseLibrary';
import WorkoutBuilder from './pages/WorkoutBuilder';
import WorkoutDiary from './pages/WorkoutDiary';
import Timer from './pages/Timer';
import UserProfile from './pages/UserProfile';
import ExerciseDetail from './pages/ExerciseDetail';
import WorkoutDetail from './pages/WorkoutDetail';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
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
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;