import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Results from './pages/Results';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react'
import './App.css'
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [count, setCount] = useState(0)

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-secondary dark:bg-dark-primary">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/login" element={<Login />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
          <ScrollToTop />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App
