import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, BarChart3, QrCode, Shield, Users, Mail, Download, Smartphone, Share, PlusSquare } from 'lucide-react';

const LandingPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="glass flex justify-between h-16 items-center px-6 rounded-2xl">
            <div className="flex items-center group cursor-pointer">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                <QrCode className="h-6 w-6" />
              </div>
              <span className="ml-3 text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600">
                Punctual
              </span>
            </div>
            <div className="hidden md:flex space-x-8 font-medium">
              <a href="#features" className="text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#about" className="text-slate-600 hover:text-indigo-600 transition-colors">About</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
              <a href="#install" className="text-slate-600 hover:text-indigo-600 transition-colors">Install App</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/login" className="px-4 py-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors">Login</Link>
              <Link to="/signup" className="btn-premium">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-44 pb-32 px-4 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-[120px] opacity-40"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-6 text-[10px] md:text-sm font-black tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full border border-indigo-100 animate-float">
            🚀 The Future of Attendance is Here
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-[1.1] tracking-tight mb-8">
            Track Attendance <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500">
              Without Friction
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Eliminate tedious roll-calls. Use dynamic QR codes to verify student attendance in milliseconds. Secure, visual, and brilliantly simple.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4">
            <Link to="/signup?role=teacher" className="btn-premium px-10 py-5 text-lg w-full sm:w-auto">
              Teacher Sign Up
            </Link>
            <Link to="/signup?role=student" className="px-10 py-5 bg-white text-slate-800 border-2 border-slate-200 rounded-2xl font-black hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow-xl text-lg w-full sm:w-auto">
              Student Sign Up
            </Link>
          </div>
        </div>
      </header>
 
      {/* Features Section */}
      <section id="features" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black mb-4">Built for Efficiency</h2>
            <p className="text-xl text-slate-500">Everything you need to manage attendance at scale.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: QrCode, title: 'Dynamic QR Codes', desc: 'Secure, time-fenced QR codes that prevent unauthorized attendance marking.', color: 'bg-blue-500' },
              { icon: BarChart3, title: 'Real-time Insights', desc: 'Beautiful analytics dashboards that show attendance trends and anomalies.', color: 'bg-indigo-500' },
              { icon: Shield, title: 'Identity Verified', desc: 'Enforced enrollment checks and timestamp validation for 100% accuracy.', color: 'bg-purple-500' }
            ].map((f, i) => (
              <div key={i} className="card-premium p-10 group cursor-default">
                <div className={`w-14 h-14 ${f.color} rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black tracking-widest text-purple-600 uppercase bg-purple-50 rounded-full border border-purple-100">
                Our Vision
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Modernizing the <br />
                <span className="text-indigo-600">Classroom Experience</span>
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed font-medium">
                Punctual was born from a simple observation: manual attendance is a waste of precious educational time. We've built a platform that's not just a tool, but a catalyst for better student engagement.
              </p>
              <ul className="space-y-4">
                {[
                  { title: 'Save 5-10 mins per class', color: 'text-green-500' },
                  { title: 'Eliminate manual entry errors', color: 'text-blue-500' },
                  { title: 'Instant digital reports', color: 'text-indigo-500' }
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 font-bold">
                    <CheckCircle className={`h-6 w-6 mr-3 ${item.color}`} />
                    {item.title}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="glass p-8 md:p-12 rounded-[3.5rem] relative z-10 border-white/40 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white/20">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-400">Total Scans</p>
                      <p className="text-xl font-black text-slate-800">1.2M+</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/50 rounded-2xl border border-white/20 translate-x-8">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-400">Accuracy</p>
                      <p className="text-xl font-black text-slate-800">100% Verified</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-400/20 blur-[100px] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl font-black mb-4">Brilliantly Simple</h2>
            <p className="text-xl text-slate-500">Three steps to a paperless classroom.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
            
            {[
              { step: '01', icon: QrCode, title: 'Teacher Generates', desc: 'The teacher creates a time-limited QR code for the class session.' },
              { step: '02', icon: Shield, title: 'Student Scans', desc: 'Students scan the code using the Punctual app on their mobile devices.' },
              { step: '03', icon: CheckCircle, title: 'Verified Instantly', desc: 'Attendance is logged, verified against enrollment, and ready for reports.' }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mb-8 shadow-xl relative z-10 group-hover:border-indigo-600 transition-colors duration-500">
                  <s.icon className="h-8 w-8 text-indigo-600" />
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                    {s.step}
                  </div>
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install PWA Section */}
      <section id="install" className="py-32 bg-indigo-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 text-slate-900">Get the Punctual App</h2>
            <p className="text-xl text-slate-500 font-medium">Experience Punctual directly from your home screen.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Android / Desktop Install */}
            <div className="card-premium p-8 md:p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-800">Android & Desktop</h3>
              <p className="text-slate-500 mb-8 font-medium">
                Install Punctual directly via Chrome or Edge for a seamless native experience.
              </p>
              <button 
                onClick={handleInstallClick}
                disabled={!isInstallable}
                className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                  isInstallable 
                  ? 'bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:scale-105' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Download className="h-6 w-6" />
                {isInstallable ? 'Install App Now' : 'App Already Installed'}
              </button>
              {!isInstallable && (
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  * If button is disabled, you're already in the app!
                </p>
              )}
            </div>

            {/* iOS Instructions */}
            <div className="card-premium p-8 md:p-12 text-center flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <div className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">iOS Guide</div>
              </div>
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl">
                <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current"><path d="M17.05,20.28c-0.96,0.95-2.05,1.72-3.11,1.72s-1.45-0.67-2.73-0.67c-1.28,0-1.87,0.65-2.65,0.65c-0.78,0-2.07-0.9-3.32-2.13 c-1.58-1.55-2.47-4.13-2.47-6.52c0-3.86,2.5-5.89,4.94-5.89c1.28,0,2.4,0.88,3.19,0.88c0.79,0,2.16-1.1c3.75-1.1c1.55,0,2.94,0.56,3.83,1.67 c-0.12,0.07-2.12,1.23-2.12,3.64c0,2.88,2.49,3.87,2.49,3.87C19.11,17.2,18.49,18.84,17.05,20.28z M12.01,7.27 c-0.03-1.92,1.58-3.55,3.42-3.69c0.15,1.89-1.51,3.7-3.35,3.84C12.06,7.4,12.04,7.34,12.01,7.27z"/></svg>
              </div>
              <h3 className="text-2xl font-black mb-6 text-slate-800">Apple iPhone / iPad</h3>
              <div className="space-y-6 w-full">
                {[
                  { icon: Share, text: 'Tap the "Share" button in Safari' },
                  { icon: PlusSquare, text: 'Select "Add to Home Screen"' },
                  { icon: CheckCircle, text: 'Tap "Add" in the top right corner' }
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 text-left p-4 bg-white/50 rounded-2xl border border-white/20">
                    <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-indigo-600">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-slate-700 font-bold">{step.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-400/5 blur-[120px] -z-10 rounded-full"></div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-3 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
              <QrCode className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Punctual</h2>
            <p className="text-slate-400 max-w-sm mx-auto mb-12">Elevating the classroom experience through smart technology.</p>
          </div>
          <div className="border-t border-slate-800 pt-10 text-slate-500 text-sm">
            &copy; 2026 Punctual. Made with ❤️ by <a className='underline text-indigo-50' href="https://theyoungpioneers.com" target="_blank" rel="noopener noreferrer">The Young Pioneers</a> for Educators.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
