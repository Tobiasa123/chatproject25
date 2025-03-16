import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import ChatPage from './pages/ChatPage/ChatPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import DashboardPage from './pages/DashboardPage/DashBoardPage';
import { isAdmin } from '../src/utils/isAdmin';

function AppContent() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const token = sessionStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    
    window.addEventListener('authChange', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-slate-300 dark:bg-slate-800 bg-[url('/src/assets/wave.svg')] bg-cover bg-bottom">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile/:id"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chat/:chatId/messages"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/" replace />}
        />
        <Route
         path="/dashboard" element={isAuthenticated && isAdmin() ? <DashboardPage /> : <Navigate to="/home" replace />} 
         />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;