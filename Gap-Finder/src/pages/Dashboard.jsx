import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  Target, 
  Home, 
  TrendingUp, 
  BookOpen, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Award,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { userProfile, currentSkills, skillGaps, roadmapData, jobReadinessScore, skillDistribution } from '../data/staticData';
import SettingsTab from '../components/SettingsTab';
import ResumeAnalyzer from '../components/ResumeAnalyzer';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [liveUser, setLiveUser] = useState(null);
  const [liveStats, setLiveStats] = useState({ total_skills: 0, completed_skills: 0, avg_progress: 0, current_streak: 0 });
  const [liveSkills, setLiveSkills] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes, skillsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/stats/dashboard'),
          api.get('/skills')
        ]);
        setLiveUser(userRes.data.data);
        setLiveStats(statsRes.data.data);
        setLiveSkills(skillsRes.data.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const readinessData = [
    {
      name: 'Readiness',
      value: jobReadinessScore,
      fill: '#6366F1'
    }
  ];

  const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#EC4899', '#10B981'];

  return (
    <div className="min-h-screen bg-[#090A0F] flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#12141D] border-r border-white/10 transition-transform duration-300`}
        data-testid="dashboard-sidebar"
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link to="/" className="flex items-center space-x-2 group" data-testid="sidebar-logo">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                GapFinder
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <button 
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              data-testid="nav-overview"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Overview</span>
            </button>
            <button 
              onClick={() => { setActiveTab('skills'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'skills' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              data-testid="nav-skills"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Skills</span>
            </button>
            <button 
              onClick={() => { setActiveTab('roadmap'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'roadmap' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              data-testid="nav-roadmap"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">Roadmap</span>
            </button>
            <button 
              onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-indigo-600/20 text-indigo-300' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              data-testid="nav-settings"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 mb-3" data-testid="user-profile">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {liveUser ? liveUser.name.split(' ').map(n => n[0]).join('') : userProfile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {liveUser ? liveUser.name : userProfile.name}
                </p>
                <p className="text-slate-500 text-xs" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {liveUser ? liveUser.email : userProfile.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              data-testid="logout-button"
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-[#090A0F]/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
                  data-testid="mobile-sidebar-toggle"
                >
                  {sidebarOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
                </button>
                <div>
                  <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }} data-testid="dashboard-title">
                    Dashboard
                  </h1>
                  <p className="text-sm text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    Welcome back, {liveUser ? liveUser.name.split(' ')[0] : userProfile.name.split(' ')[0]}!
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>Dream Job</p>
                <p className="text-white font-semibold" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {(liveUser && liveUser.dreamJob) ? liveUser.dreamJob : userProfile.dreamJob}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
          
          {activeTab === 'settings' && (
             <SettingsTab liveUser={liveUser} setLiveUser={setLiveUser} />
          )}

          {activeTab === 'overview' && (
            <div className="space-y-8">
              <ResumeAnalyzer />

              {/* Job Readiness Score - Hero Card */}
              <div className="mb-8">
            <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-3xl p-8" data-testid="readiness-score-card">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-4 py-2 mb-4">
                    <Award className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-indigo-300" style={{ fontFamily: "'Outfit', sans-serif" }}>Your Progress</span>
                  </div>
                  <h2 className="text-4xl font-black text-white mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    Job Readiness Score
                  </h2>
                  <p className="text-slate-300 text-lg mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    You're <span className="text-indigo-400 font-bold">{jobReadinessScore}%</span> ready for your dream job as a {userProfile.dreamJob}. Keep up the great work!
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                      <span className="text-slate-400">Current Level</span>
                      <span className="text-white font-medium">{userProfile.currentLevel}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-1000 ease-out"
                        style={{ width: `${jobReadinessScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <RadialBarChart 
                      cx="50%" 
                      cy="50%" 
                      innerRadius="70%" 
                      outerRadius="100%" 
                      data={readinessData} 
                      startAngle={180} 
                      endAngle={0}
                    >
                      <RadialBar
                        minAngle={15}
                        background
                        clockWise
                        dataKey="value"
                        cornerRadius={10}
                      />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-5xl font-black" fill="#F8FAFC" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                        {jobReadinessScore}%
                      </text>
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="stat-current-skills">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {currentSkills.length}
                </span>
              </div>
              <h3 className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Current Skills</h3>
            </div>

            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="stat-skill-gaps">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-3 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {skillGaps.length}
                </span>
              </div>
              <h3 className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Skills to Learn</h3>
            </div>

            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="stat-days-active">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {liveStats?.current_streak || 1}
                </span>
              </div>
              <h3 className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Daily Streak</h3>
            </div>

            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="stat-milestones">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  8/12
                </span>
              </div>
              <h3 className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Milestones Completed</h3>
            </div>
          </div>
            </div>
          )}

          {activeTab === 'skills' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Skills */}
              <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" id="skills" data-testid="current-skills-section">
                <h3 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  Your Current Skills
                </h3>
                <div className="space-y-4">
                  {(liveSkills.length > 0 ? liveSkills : currentSkills).map((skill) => (
                    <div key={skill.id} data-testid={`skill-${skill.id}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {skill.title || skill.name}
                        </span>
                        <span className="text-sm text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {skill.progress || skill.level || 0}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.progress || skill.level || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Distribution Chart */}
              <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="skill-distribution-chart">
                <h3 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  Skill Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={skillDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#94A3B8" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px' }} />
                    <YAxis stroke="#94A3B8" style={{ fontFamily: "'Outfit', sans-serif", fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#12141D', 
                        border: '1px solid rgba(255,255,255,0.1)', 
                        borderRadius: '8px',
                        fontFamily: "'Outfit', sans-serif"
                      }} 
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {skillDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Column - Skills Gap */}
            <div className="space-y-6">
              <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="skills-gap-section">
                <h3 className="text-2xl font-black text-white mb-6" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  Skills to Learn
                </h3>
                <div className="space-y-3">
                  {skillGaps.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors"
                      data-testid={`gap-skill-${skill.id}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {skill.name}
                        </span>
                        <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-1 rounded-full">
                          {skill.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Target: {skill.level}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}

          {activeTab === 'roadmap' && (
          <div className="mt-8 bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8" id="roadmap" data-testid="roadmap-section">
            <h3 className="text-3xl font-black text-white mb-8" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Your 30-90 Day Roadmap
            </h3>
            <div className="space-y-8">
              {roadmapData.map((phase, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-indigo-500" data-testid={`roadmap-phase-${index}`}>
                  <div className="absolute -left-3 top-0 w-6 h-6 bg-indigo-600 rounded-full border-4 border-[#12141D] flex items-center justify-center">
                    {phase.status === 'in-progress' && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                    {phase.status === 'upcoming' && (
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-indigo-400 mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          {phase.phase}
                        </div>
                        <h4 className="text-xl font-bold text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                          {phase.title}
                        </h4>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        phase.status === 'in-progress' 
                          ? 'bg-indigo-500/20 text-indigo-300' 
                          : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {phase.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm text-slate-400 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Skills to Focus:</div>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills.map((skill, idx) => (
                          <span key={idx} className="text-xs bg-violet-500/20 text-violet-300 px-3 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-slate-400 mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Milestones:</div>
                      <ul className="space-y-2">
                        {phase.milestones.map((milestone, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <span style={{ fontFamily: "'Outfit', sans-serif" }}>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          data-testid="sidebar-overlay"
        ></div>
      )}
    </div>
  );
};

export default Dashboard;