import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import SignInModal from './SignInModal';
import { ThemeContext } from '../ThemeContext';
import MyProfileModal from './MyProfileModal';

const NAV_LINKS = [
  { text: 'Home', href: '#home' },
  { text: 'Browse Items', href: '#listings' },
  { text: 'Report Item', href: '#report' },
  { text: 'How It Works', href: '#how-it-works' },
];

function Navbar({ onShowAdminSignIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { user } = useAuth();
  const dropdownRef = useRef();

  const handleSignOut = useCallback(() => {
    auth.signOut();
    localStorage.removeItem('user');
    window.location.reload();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdminClick = () => {
    const token = sessionStorage.getItem('adminToken');
    token
      ? window.dispatchEvent(new Event('openAdminPanel'))
      : onShowAdminSignIn();
  };

  return (
    <nav className="bg-gradient-to-r from-[#1a1330] via-[#2c1a4e] to-[#1a1330] text-white shadow-md z-50 relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => window.dispatchEvent(new Event('openQrModal'))}
          >
             <img
    src="/logo.png"
    alt="Lost&Found Logo"
    className="w-10 h-10 object-contain"
  />
            <h1 className="text-xl font-bold">Lost&Found</h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {NAV_LINKS.map(({ text, href }) => (
              <a key={text} href={href} className="hover:text-purple-300 transition">
                {text}
              </a>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleAdminClick}
              className="px-4 py-2 rounded-full border border-white hover:bg-white hover:text-purple-700 transition font-semibold"
            >
              Admin
            </button>

            {!user ? (
              <button
                onClick={() => setShowSignInModal(true)}
                className="px-4 py-2 rounded-full border border-white hover:bg-white hover:text-purple-700 transition font-semibold"
              >
                Sign In
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <img
                  src={user.photoURL || 'https://via.placeholder.com/40'}
                  alt="User"
                  onClick={() => setIsDropdownOpen(prev => !prev)}
                  className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-white hover:ring-purple-300 transition"
                />
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 rounded-lg w-40 z-50 overflow-hidden backdrop-blur-lg bg-white/10 border border-white/10 text-white"
                    >
                      <p
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setShowProfileModal(true);
                        }}
                        className="px-4 py-2 hover:bg-white/10 cursor-pointer"
                      >
                        My Profile
                      </p>
                      <p className="px-4 py-2 hover:bg-white/10 cursor-pointer">Help</p>
                      <p
                        onClick={handleSignOut}
                        className="px-4 py-2 text-red-400 hover:bg-white/10 cursor-pointer"
                      >
                        Sign Out
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* 🌙 / 🌞 Desktop Toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-full hover:bg-white/10 transition"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? '🌞' : '🌚'}
            </button>
          </div>

          {/* Mobile menu icon */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pt-4">
            <div className="flex flex-col space-y-3">
              {NAV_LINKS.map(({ text, href }) => (
                <a
                  key={text}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-purple-300 transition"
                >
                  {text}
                </a>
              ))}

              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleAdminClick();
                }}
                className="text-left hover:text-purple-300 transition"
              >
                Admin
              </button>

              {!user ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowSignInModal(true);
                  }}
                  className="text-left hover:text-purple-300 transition"
                >
                  Sign In
                </button>
              ) : (
                <div className="mt-4 text-center">
                  <img
                    src={user.photoURL || 'https://via.placeholder.com/40'}
                    className="w-10 h-10 rounded-full mx-auto"
                    alt="User"
                  />
                  <div className="mt-2 rounded-lg backdrop-blur-lg bg-white/10 text-white">
                    <p
                      onClick={() => {
                        setMenuOpen(false);
                        setShowProfileModal(true);
                      }}
                      className="py-2 text-black hover:bg-white/10 cursor-pointer"
                    >
                      My Profile
                    </p>
                    <p className="py-2 text-black hover:bg-white/10 cursor-pointer">Help</p>
                    <p
                      onClick={handleSignOut}
                      className="py-2 text-red-400 hover:bg-white/10 cursor-pointer"
                    >
                      Sign Out
                    </p>
                  </div>
                </div>
              )}

              {/* 🌙 / 🌞 Mobile Toggle with label */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setDarkMode(prev => !prev);
                }}
                className="text-left hover:text-purple-300 transition"
              >
                {darkMode ? '🌞 Light Mode' : '🌚 Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSignInModal && <SignInModal onClose={() => setShowSignInModal(false)} />}
      {showProfileModal && <MyProfileModal onClose={() => setShowProfileModal(false)} />}
    </nav>
  );
}

export default Navbar;
