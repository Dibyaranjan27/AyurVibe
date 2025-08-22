import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { NotificationsProvider } from './context/NotificationsProvider';

// Layouts
import MainLayout from './layouts/MainLayout'; // Import your new layout

// Pages
import Homepage from './pages/Homepage';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Register from './pages/Register';
import Results from './pages/Results';
import ProfileView from './pages/ProfileView';
import Dashboard from './pages/Dashboard';
import FeedbackView from './pages/FeedbackView';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import NotificationView from './pages/NotificationView';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

// Components for routes
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <AppProvider>
      <NotificationsProvider> 
        <Router>
          {/* Routes are now nested, making the layout system cleaner */}
          <Routes>
            {/* Routes WITH Navbar and Footer */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Homepage />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="results" element={<Results />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="feedback" element={<FeedbackView />} />
              <Route path="notifications" element={<NotificationView />} />
              
              <Route path="admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* Routes WITHOUT Navbar and Footer */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* The 404 page is a top-level route without the main layout */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </NotificationsProvider>
    </AppProvider>
  );
}

export default App;