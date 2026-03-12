import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { requestForToken, onMessageListener } from './firebase';

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (loading) return <div>Loading...</div>;

  if (user) {
    return <Navigate to={user.role === 'teacher' ? '/teacher-dashboard' : '/student-dashboard'} replace />;
  }

  if (isStandalone && window.location.pathname === '/') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  React.useEffect(() => {
    if (user) {
      requestForToken();
      onMessageListener().then((payload) => {
        alert(`${payload.notification.title}: ${payload.notification.body}`);
        if ('setAppBadge' in navigator) {
          navigator.setAppBadge(1).catch(err => console.error(err));
        }
      });
      
      // Clear badge when user opens app
      if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge().catch(err => console.error(err));
      }
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          
          <Route 
            path="/teacher-dashboard/*" 
            element={
              <PrivateRoute role="teacher">
                <TeacherDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/student-dashboard/*" 
            element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
