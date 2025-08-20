import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Homepage from './pages/Homepage';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Register from './pages/Register';
import Results from './pages/Results';
import ProfileView from './pages/ProfileView';
import Dashboard from './pages/Dashboard';
import FeedbackView from './pages/FeedbackView';
import AdminDashboard from './pages/AdminDashboard';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './components/Footer';
import { NotificationsProvider } from './context/NotificationsProvider';
import NotificationView from './pages/NotificationView';

function App() {

  return (
    <AppProvider>
      <NotificationsProvider> 
      <Router>
        <div className="min-h-screen bg-secondary dark:bg-dark-primary">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feedback" element={<FeedbackView />} />
              <Route path="/notifications" element={<NotificationView />} />
            </Routes>
          </main>
          <ToastContainer position="bottom-right" />
          <Footer />
        </div>
      </Router>
      </NotificationsProvider>
    </AppProvider>
  )
}

export default App
