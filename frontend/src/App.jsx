import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/store';
import { useEffect, useRef } from 'react';
import Auth from './components/Auth/Auth';
import Dashboard from './components/Dashboard/Dashboard';
import Aptitude from './components/Aptitude/Aptitude';
import Interview from './components/Interview/Interview';
import VideoInterview from './components/VideoInterview/VideoInterview';
import VoiceInterview from './components/VoiceInterview/VoiceInterview';
import Resume from './components/Resume/Resume';
import Courses from './components/Courses/Courses';
import CourseViewer from './components/Courses/CourseViewer';
import Settings from './components/Settings/Settings';
import Landing from './components/Landing/Landing';
import Sidebar from './components/Common/Sidebar';
import StudyCenter from './components/StudyCenter/StudyCenter';
import PracticeCoding from './components/StudyCenter/PracticeCoding';
import PracticeSQL from './components/StudyCenter/PracticeSQL';
import BugFixing from './components/StudyCenter/BugFixing';
import Flashcards from './components/StudyCenter/Flashcards';
import AptitudeTutorial from './components/StudyCenter/AptitudeTutorial';
import Roadmaps from './components/Roadmaps/Roadmaps';

function App() {
  const { checkAuth, isAuthenticated, loading } = useAuthStore();
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#020617',
        color: 'white'
      }}>
        <div className="spinner"></div>
        <p style={{ marginLeft: '1rem' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: '#f1f5f9' }}>
      {!isAuthenticated ? (
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      ) : (
        <div style={{ display: 'flex', flex: 1, minHeight: '100vh', width: '100%' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/aptitude" element={<Aptitude />} />
              <Route path="/interview" element={<Interview />} />
              <Route path="/video-interview" element={<VideoInterview />} />
              <Route path="/voice-interview" element={<VoiceInterview />} />
              <Route path="/resume" element={<Resume />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<CourseViewer />} />
              <Route path="/study-center" element={<StudyCenter />} />
              <Route path="/roadmaps" element={<Roadmaps />} />
              <Route path="/practice/coding" element={<PracticeCoding />} />
              <Route path="/practice/sql" element={<PracticeSQL />} />
              <Route path="/practice/debugging" element={<BugFixing />} />
              <Route path="/practice/flashcards" element={<Flashcards />} />
              <Route path="/learn/aptitude" element={<AptitudeTutorial />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
