import React, { useEffect } from 'react';

function ContactModal({ visible, onClose, item }) {
  const email = item?.userEmail || "";
  const isEmail = /\S+@\S+\.\S+/.test(email);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!visible || !item || !item.userEmail || item.resolved) return null;

  const handleContact = () => {
    if (isEmail) {
      window.location.href = `mailto:${email}?subject=Regarding your Lost & Found item: ${item.title}`;
    } else {
      alert("No valid email found.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade"
      tabIndex={-1}
    >
      <div className="max-w-md w-full p-8 rounded-2xl relative shadow-xl 
        backdrop-blur-xl bg-white/60 dark:bg-white/10 border border-white/30 dark:border-white/10 transition-colors"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-500 text-xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
          Contact 
        </h3>

        {isEmail ? (
          <div className="text-sm text-gray-800 dark:text-gray-200 space-y-4">
            <p>
              The finder has shared their email. You can click the button below to contact them.
            </p>

            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-blue-700 dark:text-blue-400 break-all">{email}</span>
              <button
                onClick={() => navigator.clipboard.writeText(email)}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
              >
                Copy
              </button>
            </div>

            <button
              onClick={handleContact}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full transition"
            >
              Open Email App
            </button>
          </div>
        ) : (
          <div className="text-red-600 dark:text-red-400 text-center font-medium">
            ⚠️ No valid email address found for this user.
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactModal;
