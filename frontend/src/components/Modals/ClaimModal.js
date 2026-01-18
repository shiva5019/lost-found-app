import React, { useEffect, useRef, useState } from 'react';

function ClaimModal({ visible, onClose, item, theme = 'dark' }) {
  const [form, setForm] = useState({ rollNo: '', name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  if (!visible || !item) return null;

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const res = await fetch(`https://lostfound-zxoz.onrender.com/api/items/${item._id}/claim`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to claim item');
      }

      setMessage('✅ Successfully claimed! Reach security office for collection.');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1800);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') onClose();
  };

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade"
      onKeyDown={handleEscape}
      tabIndex={-1}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl relative shadow-xl ${
          isDark
            ? 'glass-card text-white'
            : 'bg-white text-gray-800 border border-gray-300'
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-xl font-bold ${
            isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
          }`}
          aria-label="Close modal"
        >
          &times;
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-center">Claim This Item</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Roll Number</label>
            <input
              ref={inputRef}
              name="rollNo"
              className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${
                isDark ? 'bg-white text-black' : 'text-black'
              }`}
              placeholder="e.g. 21CS123"
              value={form.rollNo}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${
                isDark ? 'bg-white text-black' : 'text-black'
              }`}
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">College Email</label>
            <input
              name="email"
              type="email"
              className={`w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 ${
                isDark ? 'bg-white text-black' : 'text-black'
              }`}
              placeholder="your@college gmail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <div
              className={`text-center text-sm font-medium ${
                message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border rounded-full transition ${
                isDark
                  ? 'border-gray-400 text-white hover:bg-white hover:text-black'
                  : 'border-gray-400 text-gray-700 hover:bg-gray-100'
              }`}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClaimModal;
