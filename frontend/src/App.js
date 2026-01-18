import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import HowItWorks from './components/HowItWorks';
import Listings from './components/Listings';
import ReportForm from './components/ReportForm';
import Future from './components/Future';
import Footer from './components/Footer';
import MyProfileModal from './components/MyProfileModal';
import ClaimModal from './components/Modals/ClaimModal';
import ContactModal from './components/Modals/ContactModal';
import AdminPanel from './components/Modals/AdminPanel';
import SignInModal from './components/SignInModal';
import AdminSignInModal from './components/AdminSignInModal';
import QrModal from './components/Modals/QrModal';

import { useAuth } from './AuthContext';

function App() {
  const { user, setUser } = useAuth();

  const [showSignIn, setShowSignIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdminSignIn, setShowAdminSignIn] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(() => !!sessionStorage.getItem('adminToken'));
  const [showQr, setShowQr] = useState(false);

  const [selectedClaimItem, setSelectedClaimItem] = useState(null);
  const [selectedContactItem, setSelectedContactItem] = useState(null);

  // 🌙 Listen for system theme changes only
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (e) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", applyTheme);
    return () => mq.removeEventListener("change", applyTheme);
  }, []);

  useEffect(() => {
    const handleOpenClaim = (e) => {
      user ? setSelectedClaimItem(e.detail) : setShowSignIn(true);
    };
    const handleOpenContact = (e) => {
      user ? setSelectedContactItem(e.detail) : setShowSignIn(true);
    };
    const handleOpenAdminPanel = () => setShowAdminPanel(true);
    const handleOpenQr = () => setShowQr(true);

    window.addEventListener("openClaimModal", handleOpenClaim);
    window.addEventListener("openContactModal", handleOpenContact);
    window.addEventListener("openAdminPanel", handleOpenAdminPanel);
    window.addEventListener("openQrModal", handleOpenQr);

    return () => {
      window.removeEventListener("openClaimModal", handleOpenClaim);
      window.removeEventListener("openContactModal", handleOpenContact);
      window.removeEventListener("openAdminPanel", handleOpenAdminPanel);
      window.removeEventListener("openQrModal", handleOpenQr);
    };
  }, [user]);

  const handleAdminLogin = (token) => {
    sessionStorage.setItem('adminToken', token);
    setShowAdminSignIn(false);
    setShowAdminPanel(true);
  };

  const handleUserLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    setShowSignIn(false);
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-white bg-white/70 dark:bg-[#0d0b1f]">
      {/* 🎛 Navbar */}
      <Navbar
        onAdminLogin={handleAdminLogin}
        onShowSignIn={() => setShowSignIn(true)}
        onShowAdminSignIn={() => setShowAdminSignIn(true)}
      />

      {/* 🔻 Sections */}
      <Hero />
      <Listings />
      <ReportForm
        isSignedIn={!!user}
        onRequireSignIn={() => setShowSignIn(true)}
      />
      <Stats />
      <HowItWorks />
      <Future />
      <Footer />

      {/* 🔐 Admin */}
      {showAdminPanel && <AdminPanel onClose={() => setShowAdminPanel(false)} />}
      {showAdminSignIn && (
        <AdminSignInModal
          onClose={() => setShowAdminSignIn(false)}
          onSuccess={handleAdminLogin}
        />
      )}

      {/* 👤 User SignIn */}
      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          onSuccess={handleUserLogin}
        />
      )}

      {/* 📦 Item Actions */}
      {selectedClaimItem && (
        <ClaimModal
          visible={true}
          item={selectedClaimItem}
          onClose={() => setSelectedClaimItem(null)}
        />
      )}
      {selectedContactItem && (
        <ContactModal
          visible={true}
          item={selectedContactItem}
          onClose={() => setSelectedContactItem(null)}
        />
      )}

      {/* 📱 QR Modal */}
      {showQr && <QrModal onClose={() => setShowQr(false)} />}

      {/* 🧑‍💼 Profile */}
      {showProfile && <MyProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}

export default App;
