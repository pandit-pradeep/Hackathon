import React, { useState } from 'react';
import { User, Mail, Briefcase, Save, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const SettingsTab = ({ liveUser, setLiveUser }) => {
  const [formData, setFormData] = useState({
    name: liveUser?.name || '',
    email: liveUser?.email || '',
    dreamJob: liveUser?.dreamJob || ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const response = await api.put('/auth/profile', formData);
      if (response.data.success) {
        setLiveUser(response.data.data);
        setSuccessMsg('Profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8" data-testid="settings-section">
      <h3 className="text-3xl font-black text-white mb-6" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
        Profile Settings
      </h3>
      <p className="text-slate-400 mb-8" style={{ fontFamily: "'Outfit', sans-serif" }}>
        Update your personal details and career goals below.
      </p>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <p className="text-emerald-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {successMsg}
          </p>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center space-x-3">
          <p className="text-red-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {errorMsg}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="Your name"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="you@example.com"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-300 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Dream Job
          </label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              name="dreamJob"
              value={formData.dreamJob}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              placeholder="E.g. Frontend Developer"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-3 font-medium transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] flex items-center space-x-2"
          style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
        >
          <Save className="w-5 h-5" />
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>
    </div>
  );
};

export default SettingsTab;
