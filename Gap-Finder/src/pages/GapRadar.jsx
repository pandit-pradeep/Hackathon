import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Target, AlertCircle, PlaySquare, BookOpen, Code, Award, Loader2, ChevronRight, Zap } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import axios from 'axios';

// Get token from localStorage assuming user must be logged in for auth endpoints
// But since the API requires `protect`, we will send the token if available.
const gapradarToken = localStorage.getItem('token'); 

const GapRadar = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume (PDF or DOCX).");
      return;
    }
    if (!targetRole.trim()) {
      setError("Please enter a target role (e.g., Frontend Developer).");
      return;
    }

    setError(null);
    setAnalysisData(null);
    setIsExtracting(true);

    try {
      const headers = gapradarToken ? { Authorization: `Bearer ${gapradarToken}` } : {};

      // 1. Upload & Extract Text
      const formData = new FormData();
      formData.append('resume', file);
      
      const extractRes = await axios.post('http://localhost:5000/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers
        }
      });
      
      const text = extractRes.data.data?.resumeText;
      if (!text) throw new Error("Failed to extract text from file.");
      setExtractedText(text);

      setIsExtracting(false);
      setIsAnalyzing(true);

      // 2. Perform Radar Analysis
      const analysisRes = await axios.post('http://localhost:5000/api/resume/radar-analysis', {
        resumeText: text,
        targetRole: targetRole
      }, {
        headers
      });

      if (analysisRes.data && analysisRes.data.data) {
         setAnalysisData(analysisRes.data.data);
      } else {
          throw new Error("No analysis data received.");
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "An error occurred during analysis.");
    } finally {
      setIsExtracting(false);
      setIsAnalyzing(false);
    }
  };

  // Prepare radar chart data
  const generateChartData = () => {
    if (!analysisData) return [];
    
    // Combine user_skills and industry_skills
    const dataMap = {};
    
    // Base from user skills
    analysisData.user_skills?.forEach(s => {
      dataMap[s.name] = { subject: s.name, "User Level": s.level, "Industry Required": s.level, fullMark: 100 };
    });
    
    // Add gaps to calculate industry required
    analysisData.gap_analysis?.forEach(g => {
      if (dataMap[g.skill]) {
        dataMap[g.skill]["Industry Required"] = Math.min(100, dataMap[g.skill]["User Level"] + g.gap);
      } else {
        dataMap[g.skill] = { subject: g.skill, "User Level": 0, "Industry Required": g.gap > 0 ? g.gap : 50, fullMark: 100 };
      }
    });

    // Add entirely missing skills
    analysisData.missing_skills?.forEach(m => {
      if (!dataMap[m.name]) {
        dataMap[m.name] = { subject: m.name, "User Level": 0, "Industry Required": m.importance === 'high' ? 90 : 60, fullMark: 100 };
      }
    });

    return Object.values(dataMap);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pt-24 pb-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] sm:top-[-20%] left-[-10%] w-[50%] sm:w-[40%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Target className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">AI Skill Gap Radar</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            See where you stand.<br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              Know what to improve.
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Upload your resume, enter your dream role, and let our AI engine instantly visualize your skill gaps and generate a personalized roadmap.
          </p>
        </motion.div>

        {/* Input & Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Target Role Input */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g., Senior Full Stack Developer"
                  className="w-full bg-[#1A1C24] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Resume Upload Dropzone */}
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                isDragging 
                  ? 'border-violet-500 bg-violet-500/10' 
                  : 'border-white/20 bg-white/5 hover:border-violet-400/50 hover:bg-white/10'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                className="hidden" 
              />
              
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  {file ? <FileText className="w-8 h-8 text-violet-400" /> : <Upload className="w-8 h-8 text-indigo-400" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {file ? file.name : "Drop your resume here"}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "Supports PDF and DOCX formats"}
                  </p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  Browse Files
                </button>
              </div>
            </div>
            
            {/* Analyze Button */}
            <button 
              onClick={handleAnalyze}
              disabled={isExtracting || isAnalyzing || !file || !targetRole}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {isExtracting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Extracting Text...</>
              ) : isAnalyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> AI Analyzing Skills...</>
              ) : (
                <><Zap className="w-5 h-5 text-yellow-300 group-hover:scale-110 transition-transform" /> Initiate Radar Scan</>
              )}
            </button>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Gamification / Right Panel Area when no data */}
          {!analysisData && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-bl-full blur-2xl" />
                <div className="w-20 h-20 bg-gradient-to-br from-[#1A1C24] to-[#2A2D3A] rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-xl z-10">
                   <Target className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 z-10">Awaiting Data Core</h3>
                <p className="text-slate-400 max-w-sm mb-8 z-10">
                  Upload your professional profile to generate a multidimensional skill map and personalized evolution roadmap.
                </p>
                <div className="flex gap-4 w-full z-10">
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
                     <span className="block text-indigo-400 font-bold mb-1">XP System</span>
                     <span className="text-xs text-slate-400">Earn points for closing gaps</span>
                  </div>
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4">
                     <span className="block text-violet-400 font-bold mb-1">Smart Engine</span>
                     <span className="text-xs text-slate-400">AI-curated learning paths</span>
                  </div>
                </div>
             </motion.div>
          )}

          {/* Gamification Badge Header when Data Available */}
          {analysisData && (
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-gradient-to-br from-[#12141D] to-[#1A1C24] border border-white/10 rounded-2xl p-8 backdrop-blur-xl flex flex-col justify-center relative overflow-hidden container"
             >
               <div className="absolute top-0 right-0 p-8 opacity-20">
                 <Award className="w-32 h-32 text-amber-400" />
               </div>
               
               <h3 className="text-slate-400 text-sm font-bold tracking-wider uppercase mb-2">Match Score</h3>
               <div className="flex items-baseline gap-2 mb-4">
                 <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                   {analysisData.match_score}%
                 </span>
                 <span className="text-slate-300 font-medium">Ready</span>
               </div>
               
               <div className="w-full bg-[#090A0F] h-3 rounded-full overflow-hidden border border-white/10 mb-6">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${analysisData.match_score}%` }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   className={`h-full rounded-full ${
                     analysisData.match_score > 80 ? 'bg-emerald-500' : 
                     analysisData.match_score > 50 ? 'bg-amber-500' : 'bg-red-500'
                   }`}
                 />
               </div>
               
               <p className="text-slate-300 font-medium shadow-sm mb-4">
                 You are <span className="text-white font-bold">{analysisData.match_score}%</span> ready for the <span className="text-indigo-400">{targetRole}</span> role. Let's close the gap.
               </p>

               {analysisData.summary && (
                 <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-300 italic border-l-4 border-l-indigo-500">
                   "{analysisData.summary}"
                 </div>
               )}
             </motion.div>
          )}
        </div>

        {/* Results Area */}
        <AnimatePresence>
          {analysisData && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Radar Chart Visualizer */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" /> Multidimensional Skill Map
                  </h3>
                  <div className="flex-1 w-full min-h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={generateChartData()}>
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.4)" }} />
                        <Radar name="Industry Required" dataKey="Industry Required" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                        <Radar name="Your Level" dataKey="User Level" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                        <RechartsTooltip 
                           contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                           itemStyle={{ color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Gap Priorities */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-400" /> Target Gap Priorities
                  </h3>
                  <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {analysisData.gap_analysis?.length > 0 ? analysisData.gap_analysis.map((gap, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        key={idx} 
                        className={`p-4 rounded-xl border flex items-center justify-between ${
                          gap.priority.toLowerCase() === 'high' ? 'bg-red-500/10 border-red-500/30' :
                          gap.priority.toLowerCase() === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                          'bg-emerald-500/10 border-emerald-500/30'
                        }`}
                      >
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <h4 className="font-bold text-white text-lg">{gap.skill}</h4>
                               <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm ${
                                 gap.priority.toLowerCase() === 'high' ? 'bg-red-500/20 text-red-400' :
                                 gap.priority.toLowerCase() === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                 'bg-emerald-500/20 text-emerald-400'
                               }`}>
                                 {gap.priority} Priority
                               </span>
                            </div>
                            <div className="text-sm text-slate-400">Gap Size: <span className="font-mono text-white ml-1">{gap.gap}%</span></div>
                         </div>
                         
                         {/* Mini visualization of the gap */}
                         <div className="w-24 h-2 bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${gap.gap}%` }}></div>
                         </div>
                      </motion.div>
                    )) : (
                      <div className="text-emerald-400 p-8 text-center bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                         No major gaps found! You are highly qualified for this role.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations Engine Area */}
              {analysisData.recommendations?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-4 inline-flex items-center gap-3">
                    <Zap className="w-6 h-6 text-yellow-400" /> Smart Career Engine Roadmap
                  </h3>
                  
                  <div className="grid lg:grid-cols-3 gap-6">
                    {analysisData.recommendations.map((rec, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        key={idx} 
                        className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-2xl overflow-hidden group hover:border-violet-500/50 transition-colors"
                      >
                        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                          <h4 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{rec.skill}</h4>
                          <span className="px-3 py-1 bg-violet-500/20 text-violet-300 text-xs font-bold rounded-full border border-violet-500/30">+100 XP</span>
                        </div>
                        
                        <div className="p-6 space-y-6">
                           {/* Actions */}
                           {rec.actions?.length > 0 && (
                             <div>
                               <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                                 <Zap className="w-3 h-3 text-indigo-400" /> Action Items
                               </h5>
                               <ul className="space-y-2">
                                 {rec.actions.map((action, aIdx) => (
                                   <li key={aIdx} className="text-sm text-slate-300 flex items-start gap-2 bg-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors cursor-default">
                                     <ChevronRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                     <span>{action}</span>
                                   </li>
                                 ))}
                               </ul>
                             </div>
                           )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default GapRadar;
