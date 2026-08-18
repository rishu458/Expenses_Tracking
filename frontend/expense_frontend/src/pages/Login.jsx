// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import bgImage from '../assets/image.jpeg'; // Adjust path if your folder is named 'asset' instead of 'assets'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axiosClient.post('/auth/login', { 
        email: email.trim(), 
        password: password.trim() 
      });

      let token = res.data?.token;

      if (!token && res.data?.message) {
        const rawMsg = res.data.message;
        if (rawMsg.includes('welcome ')) {
          token = rawMsg.substring(rawMsg.indexOf('welcome ') + 8).trim();
        } else {
          token = rawMsg.trim();
        }
      }

      if (!token) {
        setError('Token missing in server response.');
        return;
      }

      login(token, { name: res.data?.name, email: res.data?.email });
      navigate('/dashboard');

    } catch (err) {
      if (err.response && err.response.data) {
        setError(typeof err.response.data === 'string' ? err.response.data : 'Invalid email or password');
      } else {
        setError('Cannot connect to server. Please check your backend connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Optional: Backdrop blur or overlay card styling */}
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-md p-8 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 text-center">Welcome Back to Expense Tracker</h2>
        <p className="text-sm text-slate-500 text-center mb-6">Sign in to your account</p>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 text-xs rounded-xl mb-4 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3.5 py-2 border rounded-xl text-sm outline-indigo-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-3.5 py-2 border rounded-xl text-sm outline-indigo-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium text-sm rounded-xl transition-colors"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}