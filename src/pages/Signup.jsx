import React, { useState, useContext } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserPlus, User, Lock, Mail, Users, ChevronRight } from 'lucide-react';

const Signup = () => {
  const [params] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: params.get('role') || 'student'
  });
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await signup(formData);
      if (user.role === 'teacher') navigate('/teacher-dashboard');
      else navigate('/student-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-md w-full glass rounded-5xl p-8 md:p-12 shadow-2xl relative">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-3xl mb-6 shadow-xl shadow-indigo-100 rotate-6 hover:rotate-0 transition-transform duration-500">
            <UserPlus className="h-10 w-10" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">Join Punctual for smart attendance</p>
        </div>

        {error && <div className="mb-8 p-5 bg-red-50 text-red-600 rounded-2xl text-sm border border-red-100 font-bold animate-in slide-in-from-top duration-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
            <input
              type="text"
              placeholder="Full Name"
              className="input-mobile pl-14"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
            <input
              type="email"
              placeholder="Email Address"
              className="input-mobile pl-14"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
            <input
              type="password"
              placeholder="Password"
              className="input-mobile pl-14"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="relative group">
            <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none" />
            <select
              className="input-mobile pl-14 appearance-none"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">I am a Student</option>
              <option value="teacher">I am a Teacher</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="h-5 w-5 text-slate-400 rotate-90" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full btn-premium py-5 text-xl mt-6 shadow-2xl shadow-indigo-200"
          >
            Create Account
          </button>
        </form>

        <p className="text-center mt-12 text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-600 font-black hover:underline ml-2">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
