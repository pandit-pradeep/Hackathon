import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Map, BookOpen, TrendingUp, BadgeCheck, MessageCircle, Zap, BarChart } from 'lucide-react';
import { features } from '../data/staticData';

const iconMap = {
  'target': Target,
  'map': Map,
  'book-open': BookOpen,
  'trending-up': TrendingUp,
  'badge-check': BadgeCheck,
  'message-circle': MessageCircle
};

const colorMap = {
  'indigo': 'from-indigo-500 to-indigo-600',
  'violet': 'from-violet-500 to-violet-600',
  'cyan': 'from-cyan-500 to-cyan-600',
  'pink': 'from-pink-500 to-pink-600',
  'emerald': 'from-emerald-500 to-emerald-600',
  'orange': 'from-orange-500 to-orange-600'
};

const Features = () => {
  return (
    <div className="min-h-screen bg-[#090A0F] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300" style={{ fontFamily: "'Outfit', sans-serif" }}>Powerful Features</span>
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="features-page-title"
          >
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Reach Your Goals
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
            GapFinder combines powerful analysis tools, personalized guidance, and motivational support to accelerate your career journey.
          </p>
        </div>

        {/* Featured Large Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Skill Gap Analysis */}
          <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-indigo-500/30 transition-all duration-300" data-testid="featured-skill-analysis">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl w-fit mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              Skill Gap Analysis
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Our intelligent analysis compares your current skill set with the requirements of your dream job. Get a detailed breakdown showing:
            </p>
            <ul className="space-y-3 text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-3 mt-1">✓</span>
                <span>Skills you've mastered and their proficiency levels</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-3 mt-1">✓</span>
                <span>Critical skills missing from your arsenal</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-3 mt-1">✓</span>
                <span>Skill categories breakdown (Frontend, Backend, DevOps, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 mr-3 mt-1">✓</span>
                <span>Visual charts and progress indicators</span>
              </li>
            </ul>
          </div>

          {/* Personalized Roadmap */}
          <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-violet-500/30 transition-all duration-300" data-testid="featured-roadmap">
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-4 rounded-2xl w-fit mb-6">
              <Map className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
              30-90 Day Roadmap
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Your personalized learning journey broken down into manageable phases. Each roadmap includes:
            </p>
            <ul className="space-y-3 text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <li className="flex items-start">
                <span className="text-violet-400 mr-3 mt-1">✓</span>
                <span>Clear 30-day learning phases with specific focus areas</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 mr-3 mt-1">✓</span>
                <span>Actionable milestones to track your progress</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 mr-3 mt-1">✓</span>
                <span>Skills to master in each phase</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 mr-3 mt-1">✓</span>
                <span>Timeline visualization to stay on track</span>
              </li>
            </ul>
          </div>
        </div>

        {/* All Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Target;
            const colorClass = colorMap[feature.color] || colorMap.indigo;
            
            return (
              <div
                key={feature.id}
                data-testid={`feature-detail-${index}`}
                className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-indigo-500/20 transition-all duration-300 group"
              >
                <div className={`bg-gradient-to-br ${colorClass} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="mb-16">
          <h2 
            className="text-3xl sm:text-4xl font-black text-white mb-8 text-center tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="additional-features-title"
          >
            And Much More...
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="additional-feature-0">
              <BarChart className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Visual Analytics
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Beautiful charts and graphs that make your progress easy to understand. See your growth at a glance with intuitive visualizations.
              </p>
            </div>

            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="additional-feature-1">
              <Zap className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Instant Updates
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Real-time progress tracking. As you learn and grow, your dashboard updates instantly to reflect your improvements.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-3xl p-12 text-center">
          <h2 
            className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="features-cta-title"
          >
            Ready to Experience These Features?
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Start your personalized journey today. See your skill gaps, get your roadmap, and track your progress toward your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              data-testid="features-dashboard-button"
              className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-4 font-medium transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Go to Dashboard
            </Link>
            <Link
              to="/contact"
              data-testid="features-contact-button"
              className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full px-8 py-4 backdrop-blur-md transition-all"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;