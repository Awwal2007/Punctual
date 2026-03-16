import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ManagerDashboard from './pages/ManagerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
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
    return <Navigate to={user.role === 'manager' ? '/manager-dashboard' : '/worker-dashboard'} replace />;
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
        // Show actual system banner in foreground
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(payload.notification.title, {
              body: payload.notification.body,
              icon: '/icon.png',
              badge: '/icon.png',
              tag: 'punctual-attendance',
              data: {
                url: payload.data?.url || '/login'
              }
            });
          });
        }

        // Set App Badge (Red dot)
        if ('setAppBadge' in navigator) {
          navigator.setAppBadge(1).catch(err => console.error('Error setting badge:', err));
        }
      });
      
      // Clear badge when user opens app
      if ('clearAppBadge' in navigator) {
        navigator.clearAppBadge().catch(err => console.error('Error clearing badge:', err));
      }
    }
  }, [user]);

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;

  return children;
};

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          
          <Route 
            path="/manager-dashboard/*" 
            element={
              <PrivateRoute role="manager">
                <ManagerDashboard />
              </PrivateRoute>
            } 
          />
          
          <Route 
            path="/worker-dashboard/*" 
            element={
              <PrivateRoute role="worker">
                <WorkerDashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
