const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenAI } = require('@google/genai');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse, errorResponse } = require('../utils/responseFormat');

// @desc    Upload PDF/DOCX resume and extract text
// @route   POST /api/resume/upload
// @access  Private
const uploadAndExtract = asyncHandler(async (req, res) => {
  if (!req.file) {
    return errorResponse(res, 400, 'Please upload a PDF or DOCX resume file.');
  }

  try {
    let resumeText = '';

    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      resumeText = pdfData.text;
    } else {
      const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
      resumeText = docxData.value;
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return errorResponse(res, 400, 'Could not extract sufficient text from this file.');
    }

    return successResponse(res, 200, { resumeText }, 'Resume text extracted successfully.');

  } catch (error) {
    console.error('Resume Extraction Error:', error);
    return errorResponse(res, 500, 'Failed to extract text from resume. ' + (error.message || ''));
  }
});

// @desc    Analyze extracted resume text and compare with target role
// @route   POST /api/resume/radar-analysis
// @access  Private
const radarAnalysis = asyncHandler(async (req, res) => {
  const { resumeText, targetRole } = req.body;

  if (!resumeText || !targetRole) {
    return errorResponse(res, 400, 'Please provide both resumeText and targetRole.');
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an advanced AI career analyzer.

      Analyze the given resume text and return ONLY a valid JSON response.

      Resume Text:
      """
      ${resumeText.substring(0, 4000)}
      """

      Target Role:
      "${targetRole}"

      ---

      ## Your Tasks:

      1. Extract all skills (technical + soft skills)
      2. Assign a proficiency level (0 to 100) for each skill
      3. Identify missing skills based on the target role
      4. Compare user skills with industry expectations
      5. Calculate an overall match score (0 to 100)
      6. Identify top 5 skill gaps
      7. Suggest improvements

      ---

      ## IMPORTANT RULES:

      * Return ONLY JSON (no explanation, no text)
      * Keep data realistic
      * Do not hallucinate random skills
      * Skill levels must be logical

      ---

      ## OUTPUT FORMAT:

      {
        "match_score": 72,
        "user_skills": [
          { "name": "React", "level": 75 },
          { "name": "JavaScript", "level": 80 }
        ],
        "missing_skills": [
          { "name": "System Design", "importance": "high" }
        ],
        "gap_analysis": [
          { "skill": "DSA", "gap": 40, "priority": "high" }
        ],
        "summary": "Short 2-3 line analysis of the candidate",
        "recommendations": [
          {
            "skill": "DSA",
            "actions": [
              "Practice LeetCode problems",
              "Learn data structures deeply"
            ]
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      config: {
        temperature: 0.2, // lower temperature for more consistent structured data
      }
    });

    let aiJson = response.text;
    
    // Safety cleaner if AI still outputs markdown despite constraints
    if (aiJson.includes('\`\`\`json')) {
        aiJson = aiJson.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    } else if (aiJson.includes('\`\`\`')) {
        aiJson = aiJson.replace(/\`\`\`/g, '');
    }
    
    const parsedData = JSON.parse(aiJson.trim());

    return successResponse(res, 200, parsedData, 'Radar analysis completed successfully.');

  } catch (error) {
    console.error('Radar Analysis Error:', error);
    return errorResponse(res, 500, 'Failed to analyze resume data with AI. ' + (error.message || ''));
  }
});

// @desc    Generate a learning roadmap based on resume analysis
// @route   POST /api/resume/generate-roadmap
// @access  Private
const generateRoadmap = asyncHandler(async (req, res) => {
  const { user_skills, missing_skills, gap_analysis, targetRole } = req.body;

  if (!targetRole) {
    return errorResponse(res, 400, 'Please provide targetRole.');
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      You are an expert career mentor and roadmap generator.

      Based on the user's resume analysis, generate a structured learning roadmap.

      ---

      ## INPUT DATA:

      User Skills:
      ${JSON.stringify(user_skills || [])}

      Missing Skills:
      ${JSON.stringify(missing_skills || [])}

      Gap Analysis:
      ${JSON.stringify(gap_analysis || [])}

      Target Role:
      "${targetRole}"

      ---

      ## YOUR TASK:

      Create a personalized roadmap for the user to become job-ready.

      ---

      ## ROADMAP RULES:

      1. Duration should be between 30 to 90 days
      2. Divide roadmap into phases:
         * Phase 1: Foundation
         * Phase 2: Skill Building
         * Phase 3: Advanced + Projects
         * Phase 4: Interview Preparation
      3. Each phase should include:
         * Duration (in days)
         * Skills to learn
         * Tasks
         * Mini goals
      4. Include:
         * Daily or weekly tasks
         * Real-world projects
         * Practice recommendations
      5. Focus MORE on missing/high-priority skills
      6. Keep roadmap realistic (not overloaded)

      ---

      ## IMPORTANT:

      * Return ONLY valid JSON
      * No extra text

      ---

      ## OUTPUT FORMAT:

      {
        "total_duration": "60 days",
        "phases": [
          {
            "phase_name": "Foundation",
            "duration": "15 days",
            "focus_skills": ["HTML", "CSS"],
            "tasks": [
              "Learn basic HTML structure",
              "Practice CSS layouts"
            ],
            "goal": "Build strong fundamentals"
          },
          {
            "phase_name": "Skill Building",
            "duration": "20 days",
            "focus_skills": ["JavaScript", "React"],
            "tasks": [
              "Learn JavaScript concepts",
              "Build small React projects"
            ],
            "goal": "Become comfortable with core tech"
          },
          {
            "phase_name": "Advanced + Projects",
            "duration": "15 days",
            "focus_skills": ["APIs", "Performance"],
            "tasks": [
              "Build full-stack project",
              "Optimize performance"
            ],
            "goal": "Project-ready skills"
          },
          {
            "phase_name": "Interview Preparation",
            "duration": "10 days",
            "focus_skills": ["DSA", "Communication"],
            "tasks": [
              "Solve coding problems",
              "Practice mock interviews"
            ],
            "goal": "Crack interviews confidently"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      config: {
        temperature: 0.2, // lower temperature for more consistent structured data
      }
    });

    let aiJson = response.text;
    
    // Safety cleaner if AI still outputs markdown despite constraints
    if (aiJson.includes('\`\`\`json')) {
        aiJson = aiJson.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    } else if (aiJson.includes('\`\`\`')) {
        aiJson = aiJson.replace(/\`\`\`/g, '');
    }
    
    const parsedData = JSON.parse(aiJson.trim());

    return successResponse(res, 200, parsedData, 'Roadmap generated successfully.');

  } catch (error) {
    console.error('Roadmap Generation Error:', error);
    return errorResponse(res, 500, 'Failed to generate roadmap with AI. ' + (error.message || ''));
  }
});

module.exports = { uploadAndExtract, radarAnalysis, generateRoadmap };
