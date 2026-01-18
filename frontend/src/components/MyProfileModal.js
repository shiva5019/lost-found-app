import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { auth } from "../firebase";


function MyProfileModal({ onClose }) {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!user?.email) return;

    const controller = new AbortController();

    fetch(`https://lostfound-zxoz.onrender.com/api/items?userEmail=${user.email}`, {
      signal: controller.signal,
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load items');
        return res.json();
      })
      .then(data => {
        setUserItems(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Error loading user items:', err);
          setError('Failed to load your items.');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [user]);

  const handleResolve = async (itemId) => {
    if (!window.confirm("Are you sure you want to mark this item as resolved?")) return;

    try {
      const response = await fetch(`https://lostfound-api.onrender.com/api/items/${itemId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) throw new Error("Failed to resolve item");

      const updated = await response.json();
      setUserItems(prev =>
        prev.map(item => item._id === updated.item._id ? updated.item : item)
      );
      alert("✅ Item marked as resolved.");
    } catch (err) {
      console.error("Resolve failed:", err);
      alert("❌ Could not mark item as resolved.");
    }
  };

  const handleCreatePassword = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("User not authenticated");
      return;
    }

    const token = await currentUser.getIdToken();

    const res = await fetch("https://lostfound-api.onrender.com/api/auth/create-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("✅ Password set successfully. You can now log in with email.");
      setNewPassword("");
    } else {
      alert(data.message || "Failed to create password.");
    }
  } catch (err) {
    console.error(err);
    alert("Error creating password.");
  }
};

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-3xl max-h-[90vh] overflow-y-auto relative p-6 rounded-2xl border border-white/20 bg-white/80 dark:bg-white/10 backdrop-blur-lg transition text-gray-900 dark:text-white"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-xl font-bold text-gray-800 dark:text-white hover:text-red-500 dark:hover:text-red-400"
          >
            &times;
          </button>

          <h2 className="text-3xl font-bold mb-6 text-[#ff4d4f] dark:text-[#ff4d4f]">👤 My Profile</h2>

          {user && (
            <div className="mb-6 flex items-center space-x-4">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
              )}
              <div>
                <p><strong className="text-purple-600 dark:text-purple-300">Name:</strong> {user.displayName || 'Not available'}</p>
                <p><strong className="text-purple-600 dark:text-purple-300">Email:</strong> {user.email}</p>
              </div>
            </div>
          )}

          {/* 🔐 Create/Change Password Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-purple-700 dark:text-purple-300">🔐 Create/Change Password</h3>
            <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="New Password"
    className="w-full px-4 py-2 pr-10 rounded-lg border dark:bg-white/20 dark:border-white/30 dark:text-white"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
  />
  <button
    type="button"
    onClick={() => setShowPassword(prev => !prev)}
    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 dark:text-white/70"
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
</div>

            <button
              onClick={handleCreatePassword}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full"
            >
              Save Password
            </button>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4 text-purple-700 dark:text-purple-300">📦 My Submitted Items</h3>

          {loading ? (
            <p>Loading your items...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : userItems.length === 0 ? (
            <p>
              You haven’t submitted any items yet.{' '}
              <a href="#report" className="text-blue-600 dark:text-blue-400 underline">Submit one now</a>.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userItems.map(item => (
                <article
                  key={item._id}
                  className={`rounded-xl p-4 shadow-md border border-white/20 bg-white/60 dark:bg-white/10 backdrop-blur-md transition ${
                    item.resolved ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-lg text-gray-800 dark:text-white">{item.title || 'Untitled'}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      item.type === 'lost' 
                        ? 'bg-yellow-300 text-yellow-900' 
                        : 'bg-blue-300 text-blue-900'
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-white/80 mb-2 line-clamp-2">{item.description || 'No description'}</p>
                  <p className="text-xs text-gray-600 dark:text-white/60">📍 {item.location || 'Unknown'}</p>
                  <p className="text-xs text-gray-600 dark:text-white/60">🗂 Status: {item.status}</p>
                  <p className="text-xs text-gray-600 dark:text-white/60">🎓 School ID: {item.studentId || 'Not provided'}</p>

                  {!item.resolved && item.status === 'approved' && item.foundBySecurity && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">📢 Reach security office for this item</p>
                  )}

                  {item.resolved ? (
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-2">
                      ✅ Resolved on {new Date(item.resolvedAt).toLocaleDateString()}
                    </p>
                  ) : (
                    <button
                      onClick={() => handleResolve(item._id)}
                      className="mt-3 px-4 py-1 bg-[#ff4d4f] hover:bg-red-600 text-white text-sm rounded-full transition"
                    >
                      Mark Resolved
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MyProfileModal;
