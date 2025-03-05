import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      {showNavbar && <Navbar />} 
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} /> 
        <Route path="/chat/:chatId/messages" element={<ChatPage />} />
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