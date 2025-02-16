import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';
import HomePage from './pages/HomePage/HomePage';
import ChatPage from './pages/ChatPage/ChatPage';
import './App.css'

function App() {

  return (
      <Router>
        <div className='flex flex-col justify-center items-center h-screen w-full'>
          <Routes>
            <Route path='/' element={<LoginPage/>}/>
            <Route path='/home' element={<HomePage/>}/>
            <Route path='/chat/:chatId/messages' element={<ChatPage />} />
          </Routes>
        </div>
      </Router>
  )
}

export default App
