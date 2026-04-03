import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Target } from 'lucide-react';
import api from '../utils/api';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setApiError('');
        const response = await api.post('/auth/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token);
          navigate('/dashboard');
        }
      } catch (err) {
        if (!err.response) {
          setApiError('Network Error: Cannot connect to server. Ensure the backend is running.');
        } else {
          setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
        console.error('Signup error:', err);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0F] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-3 rounded-xl">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  GapFinder
                </span>
              </div>
              <h2 className="text-4xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Start Your Journey Today
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Join thousands of students who are successfully bridging the gap to their dream careers.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-500/20 p-2 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Personalized Learning Path</h3>
                    <p className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Get a custom roadmap tailored to your goals</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-violet-500/20 p-2 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Track Your Progress</h3>
                    <p className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>See your skills improve in real-time</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-cyan-500/20 p-2 rounded-lg mt-1">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Land Your Dream Job</h3>
                    <p className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>87% success rate within 6 months</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full">
          <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <h1 
                className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                data-testid="signup-title"
              >
                Create Account
              </h1>
              <p className="text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Start your journey to your dream job
              </p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl">
                <p className="text-red-400 text-sm text-center" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {apiError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} data-testid="signup-form">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      data-testid="signup-input-name"
                      className={`w-full bg-white/5 border ${
                        errors.name ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                      placeholder="John Doe"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      data-testid="signup-input-email"
                      className={`w-full bg-white/5 border ${
                        errors.email ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                      placeholder="you@example.com"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      data-testid="signup-input-password"
                      className={`w-full bg-white/5 border ${
                        errors.password ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                      placeholder="••••••••"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      data-testid="toggle-password-visibility"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      data-testid="signup-input-confirm-password"
                      className={`w-full bg-white/5 border ${
                        errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'
                      } rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                      placeholder="••••••••"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      data-testid="toggle-confirm-password-visibility"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  data-testid="signup-submit-button"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-3 font-medium transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  Create Account
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" data-testid="login-link">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;