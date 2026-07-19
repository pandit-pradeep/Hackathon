import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#090A0F] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-2xl"></div>
              <div className="relative bg-[#12141D]/60 backdrop-blur-xl border border-indigo-500/30 p-8 rounded-full">
                <AlertCircle className="w-24 h-24 text-indigo-400" />
              </div>
            </div>
          </div>

          {/* 404 Text */}
          <h1 
            className="text-8xl sm:text-9xl font-black mb-4"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="404-title"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              404
            </span>
          </h1>

          <h2 
            className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="404-subtitle"
          >
            Page Not Found
          </h2>

          <p 
            className="text-lg text-slate-400 mb-8 max-w-md mx-auto leading-relaxed"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Oops! It seems you've ventured off the beaten path. The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              data-testid="404-home-button"
              className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-4 font-medium transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              <Home className="w-5 h-5" />
              <span>Return to Home</span>
            </Link>
            <Link
              to="/dashboard"
              data-testid="404-dashboard-button"
              className="inline-flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full px-8 py-4 backdrop-blur-md transition-all"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              <Search className="w-5 h-5" />
              <span>Go to Dashboard</span>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm text-slate-500 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Here are some helpful links instead:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                to="/about" 
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
                data-testid="404-link-about"
              >
                About
              </Link>
              <span className="text-slate-700">•</span>
              <Link 
                to="/features" 
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
                data-testid="404-link-features"
              >
                Features
              </Link>
              <span className="text-slate-700">•</span>
              <Link 
                to="/contact" 
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                style={{ fontFamily: "'Outfit', sans-serif" }}
                data-testid="404-link-contact"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;