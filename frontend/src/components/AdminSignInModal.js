import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // ⬅️ Use Lucide or any icon lib

function AdminSignInModal({ onClose, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('https://lostfound-zxoz.onrender.com/api/admin/login', {
        username,
        password
      });

      const { token } = res.data;
      if (token) {
        sessionStorage.setItem('adminToken', token);
        onSuccess(token);
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md p-6 rounded-2xl shadow-2xl relative 
        bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/10 backdrop-blur-xl transition-colors"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-700 dark:text-white hover:text-red-500 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          🛡️ Admin Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/30 dark:bg-white/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <div className="relative">
          <input
             type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/30 dark:bg-white/20 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
    type="button"
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 dark:text-white/70"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>
          {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSignInModal;
