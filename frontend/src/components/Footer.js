import React from 'react';
import { Mail, Facebook, Twitter } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#a8f0f7]/60 dark:bg-[#0e0b23]/70 text-gray-800 dark:text-white py-16 border-t border-white/20 backdrop-blur-lg transition-colors">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo + Intro */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
               <img
    src="/logo.png"
    alt="Lost&Found Logo"
    className="w-10 h-10 object-contain"
  />
              <h1
                className="text-xl font-bold cursor-pointer text-purple-600 dark:text-purple-300 hover:text-black dark:hover:text-white transition"
                onClick={() => window.dispatchEvent(new Event("openQrModal"))}
              >
                Lost&Found
              </h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-purple-100 opacity-80 leading-relaxed">
              Helping students reunite with their lost belongings since 2024.
            </p>
            {/* QR Icon or Image Trigger */}
  <img
    src="/assets/campusfind_qr_poster.png"
    alt="QR Code"
    className="w-10 h-10 cursor-pointer hover:scale-105 transition rounded shadow"
    onClick={() => window.dispatchEvent(new Event("openQrModal"))}
  />

          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-purple-200 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Browse Items', href: '#listings' },
                { name: 'Report Item', href: '#report' },
                { name: 'How It Works', href: '#how-it-works' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-purple-100 opacity-80 hover:opacity-100 transition"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-purple-200 mb-4">Support</h3>
            <ul className="space-y-2">
              {['FAQ', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map((label) => (
                <li key={label}>
                  <button
                    className="text-sm text-gray-600 dark:text-purple-100 opacity-80 hover:opacity-100 transition"
                    onClick={() => alert(`${label} section coming soon.`)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Social */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-purple-200 mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/30 dark:bg-white/10 rounded-full flex items-center justify-center hover:bg-white/40 dark:hover:bg-white/20 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-800 dark:text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/30 dark:bg-white/10 rounded-full flex items-center justify-center hover:bg-white/40 dark:hover:bg-white/20 transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-gray-800 dark:text-white" />
              </a>
            </div>
            <p className="text-sm text-gray-700 dark:text-purple-100 opacity-80">Subscribe to notifications</p>
            <form
              className="flex mt-2"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Subscribed!');
              }}
            >
              <input
                type="email"
                required
                className="bg-white/40 dark:bg-white/20 border border-white/20 rounded-l-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-white placeholder-opacity-70 focus:outline-none w-full"
                placeholder="Your email"
                aria-label="Email input"
              />
              <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded-r-lg hover:bg-purple-600 transition"
                aria-label="Subscribe"
              >
                <Mail size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 text-center text-sm text-gray-700 dark:text-purple-100 opacity-70">
          <p>© 2023 CampusFind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
