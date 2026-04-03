import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, ChevronRight, XCircle, Briefcase, Zap, Target } from 'lucide-react';
import api from '../utils/api';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    setError('');
    setAnalysisResult(null);
    
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const [targetRole, setTargetRole] = useState('');

  const handleAnalyze = async () => {
    if (!file) return;

    // Use a default role if user hasn't specified one
    const roleToAnalyze = targetRole.trim() !== '' ? targetRole.trim() : 'Software Developer';

    setIsAnalyzing(true);
    setError('');
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // 1. Extract Text
      const uploadResponse = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (!uploadResponse.data.success) {
        throw new Error('Failed to extract text from resume');
      }

      const resumeText = uploadResponse.data.data.resumeText;

      // 2. Analyze Text using the new AI prompt
      const analysisResponse = await api.post('/resume/radar-analysis', {
        resumeText: resumeText,
        targetRole: roleToAnalyze
      });

      if (analysisResponse.data.success) {
        // Map new JSON schema to expected fields in UI
        const data = analysisResponse.data.data;
        setAnalysisResult({
          current_skills: data.user_skills ? data.user_skills.map(s => s.name) : [],
          missing_skills: data.missing_skills ? data.missing_skills.map(s => s.name) : []
        });
      }
    } catch (err) {
      console.error("Resume analysis error:", err);
      setError(err.response?.data?.message || err.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalyzer = () => {
    setFile(null);
    setAnalysisResult(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-[#12141D]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden mt-8">
      {/* Background glow */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="bg-indigo-500/20 p-2.5 rounded-lg border border-indigo-500/30">
          <Briefcase className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>AI Resume Scanner</h2>
          <p className="text-slate-400 text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>Discover the gap between your resume and your dream job.</p>
        </div>
      </div>

      {!analysisResult ? (
        <div className="relative z-10">
          <div 
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
              isDragging 
                ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
                : file 
                  ? 'border-green-500/50 bg-green-500/5' 
                  : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              className="hidden" 
            />
            
            {file ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-green-500/20 p-4 rounded-full border border-green-500/30">
                  <FileText className="w-10 h-10 text-green-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">{file.name}</p>
                  <p className="text-slate-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                </div>
                <div className="w-full max-w-sm mt-4">
                   <label className="block text-sm font-medium text-slate-300 mb-1 text-left">Target Role (Optional)</label>
                   <input 
                     type="text"
                     value={targetRole}
                     onChange={(e) => setTargetRole(e.target.value)}
                     placeholder="e.g., Data Scientist"
                     className="w-full bg-[#1A1C24] border border-white/10 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                   />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={resetAnalyzer}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Change File
                  </button>
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-full font-medium transition-colors flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing Skills...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Analyze Resume</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white/5 p-4 rounded-full border border-white/10">
                  <Upload className="w-10 h-10 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-lg">Drag & Drop your Resume</p>
                  <p className="text-slate-400 text-sm mt-1">or click to browse from your computer</p>
                  <p className="text-slate-500 text-xs mt-2">Only PDF files are supported (Max 5MB)</p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-medium transition-colors mt-4 border border-white/10"
                >
                  Select File
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start space-x-2">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isAnalyzing && (
            <div className="mt-6 flex flex-col items-center justify-center p-6 bg-indigo-900/20 border border-indigo-500/20 rounded-2xl">
               <div className="relative w-16 h-16 mb-4">
                 <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                 <div className="absolute inset-2 rounded-full border-r-2 border-violet-500 animate-spin" style={{ animationDirection: 'reverse' }}></div>
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Zap className="w-6 h-6 text-indigo-400 animate-pulse" />
                 </div>
               </div>
               <p className="text-indigo-300 font-medium animate-pulse">Running advanced AI modeling on your experience...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 animate-fade-in-up">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-white font-bold text-xl">Analysis Complete</h3>
            <button 
              onClick={resetAnalyzer}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Analyze Another Resume
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths Card */}
            <div className="bg-gradient-to-b from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h4 className="text-lg font-bold text-white">Current Stack</h4>
              </div>
              <p className="text-slate-400 text-sm mb-4">The AI has identified you already possess these skills.</p>
              
              <div className="flex flex-wrap gap-2">
                {analysisResult.current_skills && analysisResult.current_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                    {skill}
                  </span>
                ))}
                {(!analysisResult.current_skills || analysisResult.current_skills.length === 0) && (
                   <span className="text-slate-500 text-sm italic">No technical skills detected.</span>
                )}
              </div>
            </div>

            {/* Gap Card */}
            <div className="bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-6 h-6 text-indigo-400" />
                <h4 className="text-lg font-bold text-white">The Gap (Missing)</h4>
              </div>
              <p className="text-slate-400 text-sm mb-4">Recommended modern skills to bridge the gap to your dream role.</p>
              
              <div className="flex flex-wrap gap-2">
                {analysisResult.missing_skills && analysisResult.missing_skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-sm font-medium flex items-center space-x-1">
                    <span>{skill}</span>
                  </span>
                ))}
                {(!analysisResult.missing_skills || analysisResult.missing_skills.length === 0) && (
                   <span className="text-slate-500 text-sm italic">You have a perfect modern stack!</span>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/5">
                 <p className="text-sm text-slate-400">Want to track these missing skills? Add them to your roadmap above!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
