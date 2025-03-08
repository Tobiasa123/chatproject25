import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import ChatPage from './pages/ChatPage/ChatPage';
import Navbar from './components/Navigation/Navigation';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import './App.css'

function AppContent() {
  const location = useLocation(); 
  const showNavbar = location.pathname !== '/'; 

  const isAuthenticated = () => {
    return !!sessionStorage.getItem('authToken'); 
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      {showNavbar && <Navbar />} 
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/home"
          element={isAuthenticated() ? <HomePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/profile/:id"
          element={isAuthenticated() ? <ProfilePage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chat/:chatId/messages"
          element={isAuthenticated() ? <ChatPage /> : <Navigate to="/" replace />}
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