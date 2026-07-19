import React from 'react';
import { Target, Users, TrendingUp, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-[#090A0F] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6">
            <Target className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300" style={{ fontFamily: "'Outfit', sans-serif" }}>About Us</span>
          </div>
          
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="about-title"
          >
            Bridging the Gap to{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Your Future
            </span>
          </h1>
          
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
            We understand the struggle. We've been there. Now we're here to help you navigate your career journey with clarity and confidence.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <h2 
              className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              data-testid="problem-section-title"
            >
              The Problem We're Solving
            </h2>
            <div className="space-y-4 text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <p className="leading-relaxed">
                Meet Sarah, a third-year computer science student. She dreams of becoming a Full Stack Developer, but she's overwhelmed. There are hundreds of courses online, countless tutorials, and everyone seems to have different advice.
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">"Should I learn React or Vue? Do I need Docker? What about DevOps?"</strong> These questions kept her up at night. She spent weeks jumping between courses, never sure if she was on the right path.
              </p>
              <p className="leading-relaxed">
                Sarah's story isn't unique. Thousands of students face the same challenges:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Lack of clarity about required skills for their dream job</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>No personalized guidance or roadmap</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Confusion from too many course options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-400 mr-2">•</span>
                  <span>Gap between college curriculum and industry requirements</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1650661926447-9efb2610f64c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3R1ZHlpbmclMjBkYXJrfGVufDB8fHx8MTc3NTA2NzUxNnww&ixlib=rb-4.1.0&q=85"
                alt="Student studying"
                className="w-full h-auto"
                data-testid="problem-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://static.prod-images.emergentagent.com/jobs/bb1400de-755b-4f9e-b48d-cf7e065ee351/images/f01859eebe18e5a761f5d9db190614d9ac312d75c4aeab0d19e3b0843b5da9ff.png"
                alt="Roadmap illustration"
                className="w-full h-auto"
                data-testid="solution-image"
              />
            </div>
          </div>

          <div>
            <h2 
              className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight"
              style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
              data-testid="solution-section-title"
            >
              Our Solution: GapFinder
            </h2>
            <div className="space-y-4 text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              <p className="leading-relaxed">
                GapFinder was born from this exact frustration. We created a platform that takes the guesswork out of career planning.
              </p>
              <p className="leading-relaxed">
                <strong className="text-white">Here's how we help:</strong>
              </p>
              <div className="space-y-4">
                <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">1. Skill Gap Analysis</h3>
                  <p className="text-sm">We analyze your current skills against your dream job requirements. No more wondering—you'll see exactly where you stand.</p>
                </div>
                <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">2. Personalized Roadmap</h3>
                  <p className="text-sm">Get a custom 30-90 day learning path with clear milestones. Know what to learn, when to learn it, and why it matters.</p>
                </div>
                <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">3. Curated Resources</h3>
                  <p className="text-sm">We recommend the best courses for YOUR specific gaps. No more decision paralysis.</p>
                </div>
                <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-2">4. Progress Tracking</h3>
                  <p className="text-sm">See your Job Readiness Score improve as you learn. Stay motivated with visual progress tracking.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-20">
          <h2 
            className="text-3xl sm:text-4xl font-black text-white mb-12 text-center tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="benefits-title"
          >
            Why Students Love GapFinder
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="benefit-card-0">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-xl w-fit mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Clear Direction
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                No more confusion. Know exactly what skills to focus on and in what order.
              </p>
            </div>

            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="benefit-card-1">
              <div className="bg-gradient-to-br from-violet-500 to-violet-600 p-3 rounded-xl w-fit mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Faster Progress
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Structured roadmaps help you learn more efficiently. Average time to job: just 4.2 months.
              </p>
            </div>

            <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6" data-testid="benefit-card-2">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-xl w-fit mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                Confidence Boost
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Track your progress and see your readiness score climb. Feel confident in interviews.
              </p>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="text-center bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-indigo-500/30 rounded-3xl p-12">
          <Users className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
          <h2 
            className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}
            data-testid="mission-title"
          >
            Our Mission
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Outfit', sans-serif" }}>
            To empower every student with clear, personalized guidance on their journey to their dream career.
            We believe talent is universal, but opportunity isn't. GapFinder bridges that gap.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;