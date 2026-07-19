import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Target, TrendingUp, BookOpen, Users } from 'lucide-react';
import { features, stats } from '../data/staticData';

const iconMap = {
  'target': Target,
  'map': Target,
  'book-open': BookOpen,
  'trending-up': TrendingUp,
  'badge-check': Target,
  'message-circle': Sparkles
};

const Home = () => {
  return (
    <div className="min-h-screen bg-[#090A0F]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-indigo-300" style={{ fontFamily: "'Outfit', sans-serif" }}>Your Career Growth Partner</span>
              </div>
              
              <h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                data-testid="hero-title"
              >
                Bridge the Gap Between Your{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Skills & Dream Job
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 mb-8 leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Get personalized skill gap analysis, a custom 30-90 day learning roadmap, and track your progress
                toward landing your dream role. No more confusion—just clear direction.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard"
                  data-testid="hero-cta-button"
                  className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-4 font-medium transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.6)]"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  <span>Analyze My Skills</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/features"
                  data-testid="hero-learn-more-button"
                  className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full px-8 py-4 backdrop-blur-md transition-all"
                  style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://static.prod-images.emergentagent.com/jobs/bb1400de-755b-4f9e-b48d-cf7e065ee351/images/6dd9267e0fc1182a1bac4a02cb3eb128be05aa54f05e648240f106c66d55b4bc.png"
                  alt="Abstract Growth Visualization"
                  className="w-full h-auto"
                  data-testid="hero-image"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-transparent"></div>
              </div>
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>10,000+</p>
                    <p className="text-sm text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>Students Helped</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-white/10 bg-[#12141D]/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <p className="text-3xl md:text-4xl font-black text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              data-testid="features-title"
            >
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Succeed
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Powerful tools designed to accelerate your journey from where you are to where you want to be.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.slice(0, 6).map((feature, index) => {
              const Icon = iconMap[feature.icon] || Target;
              return (
                <div
                  key={feature.id}
                  data-testid={`feature-card-${index}`}
                  className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300 group hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]"
                >
                  <div className={`bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/features"
              data-testid="view-all-features-button"
              className="inline-flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            >
              <span>View All Features</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
            
            <div className="relative z-10 text-center">
              <h2 
                className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
                data-testid="cta-title"
              >
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Join thousands of students who've transformed their careers with GapFinder. Your dream job is waiting.
              </p>
              <Link
                to="/signup"
                data-testid="cta-signup-button"
                className="inline-flex items-center space-x-2 bg-white text-indigo-600 hover:bg-slate-100 rounded-full px-8 py-4 font-bold transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;