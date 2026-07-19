import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Code, Send, Link2, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', path: '/features' },
      { label: 'Dashboard', path: '/dashboard' },
      { label: 'Pricing', path: '/' },
      { label: 'Roadmap', path: '/' }
    ],
    company: [
      { label: 'About', path: '/about' },
      { label: 'Contact', path: '/contact' },
      { label: 'Careers', path: '/' },
      { label: 'Blog', path: '/' }
    ],
    resources: [
      { label: 'Help Center', path: '/' },
      { label: 'Community', path: '/' },
      { label: 'Guides', path: '/' },
      { label: 'API Docs', path: '/' }
    ],
    legal: [
      { label: 'Privacy', path: '/' },
      { label: 'Terms', path: '/' },
      { label: 'Cookie Policy', path: '/' },
      { label: 'Licenses', path: '/' }
    ]
  };

  return (
    <footer className="bg-[#090A0F] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 group mb-4" data-testid="footer-logo">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                GapFinder
              </span>
            </Link>
            <p className="text-sm text-slate-400 mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Bridge the gap between your skills and your dream job.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" data-testid="social-github">
                <Code className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" data-testid="social-twitter">
                <Send className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" data-testid="social-linkedin">
                <Link2 className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
              </a>
              <a href="#" className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors" data-testid="social-mail">
                <Mail className="w-4 h-4 text-slate-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-3 capitalize" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      data-testid={`footer-link-${link.label.toLowerCase().replace(' ', '-')}`}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
            © {currentYear} GapFinder. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors" data-testid="footer-status">
              Status
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors" data-testid="footer-security">
              Security
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors" data-testid="footer-accessibility">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;