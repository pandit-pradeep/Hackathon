import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Target } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Simulate login (frontend only - no real authentication)
      console.log('Login attempted:', formData);
      // Redirect to dashboard
      navigate('/dashboard');
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
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-violet-600/20 rounded-3xl blur-3xl"></div>
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
                Welcome Back!
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Continue your journey to bridging the gap between your current skills and your dream job.
              </p>
              <img
                src="https://static.prod-images.emergentagent.com/jobs/bb1400de-755b-4f9e-b48d-cf7e065ee351/images/f01859eebe18e5a761f5d9db190614d9ac312d75c4aeab0d19e3b0843b5da9ff.png"
                alt="Roadmap"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <h1 
                className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                data-testid="login-title"
              >
                Log In
              </h1>
              <p className="text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} data-testid="login-form">
              <div className="space-y-5">
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
                      data-testid="login-input-email"
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
                      data-testid="login-input-password"
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500/50"
                      data-testid="remember-me-checkbox"
                    />
                    <span className="ml-2 text-sm text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  data-testid="login-submit-button"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-3 font-medium transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  Log In
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Don't have an account?{' '}
                <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors" data-testid="signup-link">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;