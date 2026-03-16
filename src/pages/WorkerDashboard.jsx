import React, { useState, useEffect, useRef, useContext } from 'react';
import { Routes, Route, NavLink, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Layout, QrCode, LogOut, Clock, CheckCircle, AlertCircle, Users, Menu, X, Loader2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { AuthContext } from '../context/AuthContext';

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-4 mt-6 md:mt-0">Worker Menu</p>
      <NavLink 
        to="/worker-dashboard" 
        end
        onClick={() => setIsSidebarOpen(false)}
        className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
      >
        <Layout className="h-5 w-5 mr-3" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink 
        to="/worker-dashboard/scan" 
        onClick={() => setIsSidebarOpen(false)}
        className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
      >
        <QrCode className="h-5 w-5 mr-3" />
        <span>Scan QR</span>
      </NavLink>
      <NavLink 
        to="/worker-dashboard/history" 
        onClick={() => setIsSidebarOpen(false)}
        className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
      >
        <Clock className="h-5 w-5 mr-3" />
        <span>History</span>
      </NavLink>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-40">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <QrCode className="h-5 w-5" />
          </div>
          <span className="ml-2 text-xl font-black tracking-tighter text-indigo-600">Punctual</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white flex flex-col p-6 shadow-2xl z-50 transition-transform duration-300 md:relative md:translate-x-0 md:shadow-sm md:z-20
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <QrCode className="h-5 w-5" />
            </div>
            <span className="ml-3 text-xl font-black tracking-tighter text-indigo-600">Punctual</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavLinks />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center p-4 text-red-600 hover:bg-red-50 rounded-2xl transition-colors font-bold cursor-pointer">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative pt-20 md:pt-8">
        <Routes>
          <Route path="/" element={<WorkerOverview />} />
          <Route path="/scan" element={<Scanner />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
};

const WorkerOverview = () => {
  const [history, setHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  useEffect(() => {
    api.get('/attendance/history').then(res => setHistory(res.data));
    api.get('/sessions').then(res => setSessions(res.data));
  }, []);

  return (
    <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Worker Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1 text-sm">Track your presence and shift history.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        <div className="card-premium p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shadow-sm`}>
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</span>
          </div>
          <h3 className="text-slate-500 font-bold text-xs tracking-wide">Total Check-ins</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{history.length}</p>
        </div>
        <div className="card-premium p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm`}>
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned</span>
          </div>
          <h3 className="text-slate-500 font-bold text-xs tracking-wide">My Sessions</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{sessions.length}</p>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="mb-10 animate-in slide-in-from-bottom duration-500">
          <h2 className="text-[10px] font-black uppercase tracking-tight text-slate-400 mb-4 px-2">Assigned Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map(c => (
              <div key={c._id} className="card-premium p-6 flex items-center justify-between group hover:bg-white transition-all">
                <div>
                  <h3 className="font-black text-slate-800">{c.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.section || 'General'}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card-premium p-6 md:p-8 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white relative overflow-hidden">
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black mb-3 flex items-center justify-center md:justify-start">
            <QrCode className="mr-2 h-6 w-6" /> Mark Attendance
          </h2>
          <p className="text-indigo-100 mb-6 max-w-lg font-medium mx-auto md:mx-0 text-sm">Ready to scan the session QR code? Open the camera and hold it steady.</p>
          <Link to="/worker-dashboard/scan" className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-black shadow-2xl hover:scale-105 transition-all w-full md:w-auto justify-center text-sm">
            Open Scanner
          </Link>
        </div>
        <CheckCircle className="absolute right-[-30px] bottom-[-30px] h-48 w-48 text-white/5 -rotate-12 hidden md:block" />
      </div>
    </div>
  );
};



const Scanner = () => {
  const [status, setStatus] = useState({ type: '', message: '', notEnrolled: false, sessionId: '', sessionName: '' });
  const [joining, setJoining] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const scannerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Only create one instance
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
    }

    const startScanner = async () => {
      // Don't start if already scanning or on a dead element
      if (scannerRef.current.isScanning) return;
      
      try {
        await scannerRef.current.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            try {
              if (scannerRef.current.isScanning) {
                await scannerRef.current.stop();
                setIsStarted(false);
              }
              const data = JSON.parse(decodedText);
              const res = await api.post('/attendance/mark', { sessionId: data.sessionId });
              setStatus({ type: 'success', message: res.data.message, notEnrolled: false });
            } catch (err) {
              if (err.response?.status === 403 && err.response?.data?.notEnrolled) {
                setStatus({ 
                  type: 'error', 
                  message: err.response.data.message,
                  notEnrolled: true,
                  sessionId: err.response.data.sessionId,
                  sessionName: err.response.data.sessionName
                });
              } else {
                setStatus({ type: 'error', message: err.response?.data?.message || 'Invalid QR or already marked', notEnrolled: false });
                // Retry after delay
                setTimeout(() => {
                  if (scannerRef.current && !scannerRef.current.isScanning) {
                    startScanner();
                  }
                }, 3000);
              }
            }
          },
          () => {} // Ignore scan errors
        );
        setIsStarted(true);
      } catch (err) {
        console.error("Scanner failed:", err);
        setStatus({ type: 'error', message: 'Camera error. Please check permissions.' });
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(e => console.error("Cleanup error:", e));
      }
    };
  }, []);

  const handleCancel = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop().catch(() => {});
    }
    navigate('/worker-dashboard');
  };

  const handleJoinSession = async () => {
    setJoining(true);
    try {
      await api.post(`/sessions/${status.sessionId}/join`);
      setStatus({ type: 'success', message: `Successfully joined ${status.sessionName}!`, notEnrolled: false });
      // Redirect after a short delay
      setTimeout(() => navigate('/worker-dashboard'), 2000);
    } catch (err) {
      setStatus({ ...status, message: 'Failed to join session. Please try again.' });
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-6 px-4 pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Scan QR Code</h1>
        <button 
          onClick={handleCancel}
          className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all active:scale-95"
        >
          Cancel
        </button>
      </div>

      <div className="card-premium p-4 md:p-8 bg-white border border-slate-200">
        <div id="reader" className="mb-8 rounded-3xl overflow-hidden shadow-inner bg-slate-950 border-4 border-slate-100 min-h-[300px]"></div>
        
        {status.message && (
          <div className="space-y-4 mb-6">
            <div className={`p-6 rounded-2xl flex items-center text-lg font-bold animate-in zoom-in duration-300 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle className="mr-3 h-6 w-6" /> : <AlertCircle className="mr-3 h-6 w-6" />}
              {status.message}
            </div>
            
            {status.notEnrolled && (
              <div className="p-6 bg-indigo-50 rounded-2xl border-2 border-indigo-100 flex flex-col items-center animate-in slide-in-from-top duration-500">
                <p className="text-indigo-900 font-bold text-center mb-4">Would you like to register for {status.sessionName}?</p>
                <button 
                  onClick={handleJoinSession}
                  disabled={joining}
                  className="w-full btn-premium py-4 flex items-center justify-center"
                >
                  {joining ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : (
                    <Users className="h-5 w-5 mr-2" />
                  )}
                  {joining ? 'Joining...' : 'Join Session Now'}
                </button>
              </div>
            )}
          </div>
        )}

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-indigo-600">
            <div className={`w-2 h-2 rounded-full bg-indigo-600 ${isStarted ? 'animate-ping' : 'opacity-20'}`}></div>
            <span className="font-black uppercase tracking-widest text-[10px]">
              {isStarted ? 'Camera Active' : 'Initializing...'}
            </span>
          </div>
          <p className="text-slate-400 font-medium text-sm leading-relaxed px-4">
            Position the session QR code within the frame to automatically mark your presence.
          </p>
        </div>
      </div>
    </div>
  );
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filterSession, setFilterSession] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    api.get('/attendance/history').then(res => setHistory(res.data));
    api.get('/sessions').then(res => setSessions(res.data));
  }, []);

  const filteredHistory = history.filter(h => {
    const matchesSession = filterSession ? h.session._id === filterSession : true;
    const matchesDate = filterDate ? new Date(h.timestamp).toLocaleDateString() === new Date(filterDate).toLocaleDateString() : true;
    return matchesSession && matchesDate;
  });

  return (
    <div className="max-w-4xl mx-auto pt-6">
      <h1 className="text-3xl font-black text-slate-800 mb-8 tracking-tight text-center md:text-left">Check-in History</h1>
      
      <div className="card-premium overflow-hidden border border-slate-100">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row gap-4">
          <select 
            className="input-mobile py-3! text-sm! flex-1"
            value={filterSession}
            onChange={e => setFilterSession(e.target.value)}
          >
            <option value="">All Sessions</option>
            {sessions.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          <input 
            type="date" 
            className="input-mobile py-3! text-sm! flex-1"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Session</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Time</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredHistory.length > 0 ? filteredHistory.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-800">{h.session.name}</td>
                  <td className="px-6 py-5 text-slate-600 font-medium">{new Date(h.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-5 text-slate-600 font-medium">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="px-6 py-5 text-right md:text-left">
                    <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-wide">Present</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center text-slate-400">
                      <Clock className="h-12 w-12 mb-4 opacity-20" />
                      <p className="text-lg font-bold">No records matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
