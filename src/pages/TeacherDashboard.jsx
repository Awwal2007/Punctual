import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, NavLink, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Layout, Users, BookOpen, QrCode, LogOut, Plus, ChevronRight, BarChart3, Menu, X, Download, FileDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { AuthContext } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);



const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await api.get('/classes');
    setClasses(res.data);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLinks = () => (
    <>
      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-3 mb-4 mt-6 md:mt-0">Main Menu</p>
      <NavLink 
        to="/teacher-dashboard" 
        end
        onClick={() => setIsSidebarOpen(false)} 
        className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
      >
        <Layout className="h-5 w-5 mr-3" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink 
        to="/teacher-dashboard/classes" 
        onClick={() => setIsSidebarOpen(false)} 
        className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
      >
        <BookOpen className="h-5 w-5 mr-3" />
        <span>My Classes</span>
      </NavLink>
      <NavLink 
        to="/teacher-dashboard/reports" 
        onClick={() => setIsSidebarOpen(false)} 
        className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
      >
        <BarChart3 className="h-5 w-5 mr-3" />
        <span>Reports</span>
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
          <Route path="/" element={<Overview classes={classes} />} />
          <Route path="/classes" element={<ClassesManager classes={classes} refresh={fetchClasses} />} />
          <Route path="/reports" element={<Reports classes={classes} />} />
        </Routes>
      </main>
    </div>
  );
};

const Overview = ({ classes }) => (
  <div className="animate-in fade-in duration-700 max-w-5xl mx-auto">
    <header className="mb-8 text-center md:text-left">
      <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Teacher Overview</h1>
      <p className="text-slate-500 font-medium mt-1 text-sm">Manage your attendance and classes seamlessly.</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
      {[
        { label: 'Total Classes', value: classes.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Sessions', value: '0', icon: QrCode, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Today\'s Attendance', value: '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }
      ].map((stat, i) => (
        <div key={i} className="card-premium p-5 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span>
          </div>
          <h3 className="text-slate-500 font-bold text-xs tracking-wide">{stat.label}</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
        </div>
      ))}
    </div>

    <div className="card-premium p-6 md:p-8 bg-linear-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white relative overflow-hidden">
      <div className="relative z-10 text-center md:text-left">
        <h2 className="text-xl md:text-2xl font-black mb-3 flex items-center justify-center md:justify-start">
          <Plus className="mr-2 h-6 w-6" /> New Class
        </h2>
        <p className="text-indigo-100 mb-6 max-w-lg font-medium mx-auto md:mx-0 text-sm">Ready to start a new session? Create a class and invite your students with ease.</p>
        <Link to="/teacher-dashboard/classes" className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-black shadow-2xl hover:scale-105 transition-all w-full md:w-auto justify-center text-sm">
          Manage Classes
        </Link>
      </div>
      <QrCode className="absolute right-[-30px] bottom-[-30px] h-48 w-48 text-white/5 -rotate-12 hidden md:block" />
    </div>
  </div>
);

const ClassesManager = ({ classes, refresh }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [expandedClass, setExpandedClass] = useState(null);

  useEffect(() => {
    let timer;
    if (expiresAt) {
      const updateTimer = () => {
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diff = expiry - now;

        if (diff <= 0) {
          setTimeLeft('EXPIRED');
          clearInterval(timer);
          return;
        }

        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, '0')}`);
      };

      updateTimer();
      timer = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(timer);
  }, [expiresAt]);

  const handleAddClass = async (e) => {
    e.preventDefault();
    await api.post('/classes', { name: className, section });
    setClassName('');
    setSection('');
    setShowAdd(false);
    refresh();
  };

  const generateQR = async (classId) => {
    const res = await api.post('/attendance/generate-qr', { classId, durationMinutes: 30 });
    setQrUrl(res.data.qrUrl);
    setExpiresAt(res.data.expiresAt);
    setSelectedClass(classes.find(c => c._id === classId));
  };

  const closeSession = () => {
    setQrUrl('');
    setExpiresAt(null);
    setTimeLeft('');
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Manage Classes</h1>
          <p className="text-slate-500 font-medium mt-1">Add, update or generate attendance codes.</p>
        </div>
        <button className="btn-premium flex items-center w-full md:w-auto justify-center" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="h-5 w-5 mr-2" /> Add Class
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddClass} className="card-premium p-6 md:p-8 mb-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 animate-in zoom-in duration-300">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Class Name</label>
            <input 
              className="input-mobile" 
              placeholder="e.g. Computer Science" 
              value={className} 
              onChange={e => setClassName(e.target.value)} 
              required 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Section</label>
            <input 
              className="input-mobile" 
              placeholder="e.g. Semester 2" 
              value={section} 
              onChange={e => setSection(e.target.value)} 
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full btn-premium py-4">Create Class</button>
          </div>
        </form>
      )}

      {qrUrl && selectedClass && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-100 p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300 scale-100 overflow-hidden relative border border-white/20">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-indigo-600 to-purple-600"></div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 truncate px-4">{selectedClass.name}</h2>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className={`w-2 h-2 rounded-full ${timeLeft === 'EXPIRED' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                {timeLeft === 'EXPIRED' ? 'Session Expired' : `Session Active • ${timeLeft} Remaining`}
              </p>
            </div>

            <div className={`bg-slate-50 p-6 rounded-4xl inline-block mb-10 border-4 border-indigo-50 shadow-inner ${timeLeft === 'EXPIRED' ? 'grayscale opacity-50' : ''}`}>
              <img src={qrUrl} alt="QR Code" className="w-56 h-56 md:w-64 md:h-64 mix-blend-multiply" />
            </div>
            <button onClick={closeSession} className="w-full btn-premium py-5 text-xl">Close Session</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {classes.length > 0 ? classes.map(c => (
          <React.Fragment key={c._id}>
            <div className="card-premium p-6 md:p-8 group flex flex-col sm:flex-row justify-between items-center gap-6 hover:bg-slate-50 transition-all">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]"></span>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Class</p>
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{c.name}</h3>
              <p className="text-slate-500 font-bold mt-1 uppercase tracking-wider text-[10px]">{c.section || 'General'}</p>
              
              <button 
                onClick={() => setExpandedClass(expandedClass === c._id ? null : c._id)}
                className="mt-4 flex items-center text-indigo-600 font-bold text-xs uppercase tracking-widest hover:text-indigo-800 transition-colors"
              >
                <Users className="h-4 w-4 mr-2" />
                {c.students?.length || 0} Registered Students
                <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${expandedClass === c._id ? 'rotate-90' : ''}`} />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button className="flex items-center px-6 py-4 bg-indigo-50 text-indigo-700 rounded-2xl font-black hover:bg-indigo-600 hover:text-white transition-all justify-center shadow-sm" onClick={() => generateQR(c._id)}>
                <QrCode className="h-5 w-5 mr-3" /> QR
              </button>
            </div>
          </div>

          {/* Expanded Student List */}
          {expandedClass === c._id && (
            <div className="col-span-1 md:col-span-2 card-premium p-0 mb-8 border border-indigo-100 overflow-hidden animate-in slide-in-from-top duration-500">
              <div className="bg-indigo-50/50 p-4 border-b border-indigo-100 flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-900">Registered Students - {c.name}</h4>
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {c.students?.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Student ID</th>
                        <th className="px-6 py-4">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {c.students.map(student => (
                        <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-700">{student.name}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs font-black tracking-tight">{student.studentId || 'N/A'}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{student.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-10 text-center text-slate-400 italic">
                    No students registered for this class yet.
                  </div>
                )}
              </div>
            </div>
          )}
          </React.Fragment>
        )) : (
          <div className="col-span-1 md:col-span-2 card-premium p-20 text-center flex flex-col items-center">
            <BookOpen className="h-16 w-16 text-slate-200 mb-6" />
            <p className="text-xl font-bold text-slate-400">No classes found. Create one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};


const Reports = ({ classes }) => {
  const [history, setHistory] = useState([]);
  const [selectedExportClass, setSelectedExportClass] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  
  // New Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    api.get('/attendance/history').then(res => setHistory(res.data));
  }, []);

  // Filtering Logic
  const filteredHistory = history.filter(h => {
    const matchesSearch = 
      h.student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (h.student.studentId && h.student.studentId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesClass = filterClass ? h.class._id === filterClass : true;
    
    const matchesDate = filterDate ? new Date(h.timestamp).toLocaleDateString() === new Date(filterDate).toLocaleDateString() : true;

    return matchesSearch && matchesClass && matchesDate;
  });

  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{
      label: 'Attendance Count',
      data: [12, 19, 3, 5, 2, 3, 9],
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const handleExport = async () => {
    if (!selectedExportClass) {
      alert('Please select a class to export');
      return;
    }

    setIsExporting(true);
    try {
      const response = await api.get(`/attendance/export/${selectedExportClass}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `attendance_${classes.find(c => c._id === selectedExportClass)?.name || 'report'}.csv`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export attendance. Make sure records exist for this class.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pt-6">
      <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-8 tracking-tight text-center md:text-left">Attendance Reports</h1>
      
      <div className="card-premium p-6 md:p-10 mb-10 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Attendance Trends</h3>
          <BarChart3 className="text-indigo-600 h-6 w-6" />
        </div>
        <div className="h-[300px] md:h-[400px]">
          <Line data={data} options={{ 
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { display: false } },
              x: { grid: { display: false } }
            }
          }} />
        </div>
      </div>

      <div className="card-premium overflow-hidden border border-slate-100">
        <div className="p-6 md:p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Attendance Records</h3>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select 
                className="input-mobile py-2! text-sm! flex-1 md:w-48"
                value={selectedExportClass}
                onChange={(e) => setSelectedExportClass(e.target.value)}
              >
                <option value="">Select Class to Export</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <button 
                onClick={handleExport}
                disabled={isExporting || !selectedExportClass}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  isExporting || !selectedExportClass
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-105 active:scale-95'
                }`}
              >
                <FileDown className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
          </div>

          {/* Filters UI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative group">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search Student Name or ID..."
                className="input-mobile pl-11! py-3! text-sm!"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              className="input-mobile py-3! text-sm!"
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <input 
              type="date" 
              className="input-mobile py-3! text-sm!"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Student</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Student ID</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Class</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredHistory.length > 0 ? filteredHistory.map((h, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-800">{h.student.name}</td>
                  <td className="px-6 py-5 text-slate-500 text-xs font-black tracking-tight">{h.student.studentId || 'N/A'}</td>
                  <td className="px-6 py-5 text-slate-600 font-medium">{h.class.name}</td>
                  <td className="px-6 py-5 text-slate-500 text-xs font-bold">{new Date(h.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-5 text-slate-500 text-xs font-bold">{new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <p className="text-slate-400 font-bold">No records match your filters.</p>
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

export default TeacherDashboard;
