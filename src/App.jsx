import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { requestForToken, onMessageListener } from './firebase';
import { Loader2, QrCode } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
    <div className="relative">
      <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-bounce">
        <QrCode className="h-10 w-10" />
      </div>
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 whitespace-nowrap">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
        <span className="text-slate-600 font-black tracking-widest uppercase text-xs">Punctual is loading</span>
      </div>
    </div>
  </div>
);

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (loading) return <LoadingScreen />;

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

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;

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
