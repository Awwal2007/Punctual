import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, User, Lock, Mail, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'teacher') navigate('/teacher-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-md w-full glass rounded-5xl p-8 md:p-12 shadow-2xl relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-3xl mb-6 shadow-xl shadow-indigo-100 rotate-6 hover:rotate-0 transition-transform duration-500">
            <LogIn className="h-10 w-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">Welcome Back</h2>
          <p className="text-slate-500 mt-2 font-medium">Continue your smart journey</p>
        </div>

        {error && <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 font-bold animate-in slide-in-from-top duration-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
            <input
              type="email"
              placeholder="Email Address"
              className="input-mobile pl-14"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
            <input
              type="password"
              placeholder="Password"
              className="input-mobile pl-14"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full btn-premium py-5 text-xl mt-6 shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 transition-all ${
              isLoading ? 'opacity-70 cursor-not-allowed scale-[0.98]' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center mt-12 text-slate-500 font-medium">
          New here? <Link to="/signup" className="text-indigo-600 font-black hover:underline ml-2">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
