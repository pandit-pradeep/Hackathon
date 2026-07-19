// Central place for demo/static data used by pages.
// Note: These exports are consumed by Home, Features, and Dashboard.

export const userProfile = {
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  dreamJob: 'Frontend Developer',
  currentLevel: 'Intermediate',
};

export const currentSkills = [
  { id: 'js', name: 'JavaScript', level: 78 },
  { id: 'react', name: 'React', level: 72 },
  { id: 'css', name: 'CSS', level: 65 },
  { id: 'git', name: 'Git & GitHub', level: 60 },
  { id: 'testing', name: 'Testing Basics', level: 52 },
];

export const skillGaps = [
  { id: 'ts', name: 'TypeScript', category: 'Frontend', level: 85 },
  { id: 'perf', name: 'Performance Optimization', category: 'Frontend', level: 75 },
  { id: 'a11y', name: 'Accessibility (A11y)', category: 'Frontend', level: 70 },
  { id: 'ux', name: 'UI/UX Fundamentals', category: 'Design', level: 65 },
];

export const roadmapData = [
  {
    onoffline,
    status: 'in-progress',
    phase: 'Phase 1',
    title: 'Strengthen Core Frontend',
    skills: ['TypeScript fundamentals', 'React advanced patterns', 'Accessibility basics'],
    milestones: ['Complete TS fundamentals', 'Build 2 small feature components', 'Audit one page for A11y'],
  },
  {
    status: 'upcoming',
    phase: 'Phase 2',
    title: 'Ship & Improve Quality',
    skills: ['Performance profiling', 'Testing strategy', 'UI/UX refinements'],
    milestones: ['Add performance benchmarks', 'Write component tests', 'Improve design consistency'],
  },
  {
    status: 'upcoming',
    phase: 'Phase 3',
    title: 'Career Readiness',
    skills: ['Portfolio improvements', 'Resume refresh', 'Mock interviews'],
    milestones: ['Update portfolio project', 'Tailor resume for role', 'Practice interview questions'],
  },
];

export const jobReadinessScore = 62;

export const skillDistribution = [
  { name: 'JavaScript', value: 78, color: '#6366F1' },
  { name: 'React', value: 72, color: '#8B5CF6' },
  { name: 'CSS', value: 65, color: '#06B6D4' },
  { name: 'Git', value: 60, color: '#EC4899' },
  { name: 'Testing', value: 52, color: '#10B981' },
];

export const stats = [
  { value: '10,000+', label: 'Students Helped' },
  { value: '30-90', label: 'Day Roadmap' },
  { value: '4-6', label: 'Core Skills Identified' },
  { value: '98%', label: 'Guidance Satisfaction' },
];

export const features = [
  {
    id: 'f1',
    icon: 'target',
    color: 'indigo',
    title: 'Skill Gap Analysis',
    description: 'Understand what you know, what you’re missing, and what to focus on next.',
  },
  {
    id: 'f2',
    icon: 'map',
    color: 'violet',
    title: 'Personalized Roadmap',
    description: 'A clear 30-90 day plan with milestones and focus areas for your goal.',
  },
  {
    id: 'f3',
    icon: 'book-open',
    color: 'cyan',
    title: 'Learning Roadblocks',
    description: 'Identify weak topics and get suggestions to close them efficiently.',
  },
  {
    id: 'f4',
    icon: 'trending-up',
    color: 'pink',
    title: 'Progress Tracking',
    description: 'Measure readiness and keep your momentum with simple visual dashboards.',
  },
  {
    id: 'f5',
    icon: 'badge-check',
    color: 'emerald',
    title: 'Milestone Rewards',
    description: 'Track completed steps and build confidence as you move forward.',
  },
  {
    id: 'f6',
    icon: 'message-circle',
    color: 'orange',
    title: 'Motivational Support',
    description: 'Actionable guidance to help you stay consistent and avoid confusion.',
  },
];