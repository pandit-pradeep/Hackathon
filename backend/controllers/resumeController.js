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
You are an AI Resume Analyzer for a platform called GapFinder.

Analyze the resume and return ONLY valid JSON in the exact structure below.

---

INPUT:

Resume Text:
"""
${resumeText.substring(0, 4000)}
"""

Target Role:
"${targetRole}"

---

TASKS:

1. Extract user skills with level (0–100)
2. Identify missing skills
3. Calculate match score
4. Create gap analysis
5. Improve resume content
6. Generate job matches
7. Create learning roadmap

---

STRICT RULES:

- Return ONLY JSON
- Do NOT add explanation
- Do NOT change field names
- Follow exact structure
- MUST IDENTIFY AT LEAST 5 TO 8 MISSING SKILLS based on modern industry standards for the target role.
- MUST CREATE A DETAILED ROADMAP with at least 4 to 6 distinct periods (e.g. Week 1, Week 2, ..., Week 6).

---

OUTPUT FORMAT:

{
"match_score": 72,

"user_skills": [
{ "name": "React", "level": 70 },
{ "name": "JavaScript", "level": 80 }
],

"missing_skills": [
{ "name": "System Design", "priority": "high" }
],

"gap_analysis": [
{ "skill": "DSA", "gap": 40, "priority": "high" }
],

"resume_improvement": {
"original_summary": "Short summary from resume",
"improved_summary": "Professionally rewritten summary",
"improved_points": [
"Improved bullet point 1",
"Improved bullet point 2"
]
},

"job_matches": [
{
"title": "Frontend Developer",
"match": 68,
"missing_skills": ["DSA", "Testing"]
}
],

"roadmap": [
{
"week": 1,
"focus": "HTML & CSS",
"tasks": ["Build a landing page"]
}
],

"summary": "You have strong frontend basics but need improvement in DSA and system design."
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }]}],
      config: {
        temperature: 0.2, // lower temperature for more consistent structured data
        responseMimeType: "application/json"
      }
    });

    const content = response.text;

    console.log("AI RAW:", content); // 👈 CHECK THIS

    let parsedData;

    try {
      let aiJson = content;
      // Safety cleaner if AI still outputs markdown despite constraints
      if (aiJson.includes('\`\`\`json')) {
          aiJson = aiJson.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
      } else if (aiJson.includes('\`\`\`')) {
          aiJson = aiJson.replace(/\`\`\`/g, '');
      }
      parsedData = JSON.parse(aiJson.trim());
    } catch (e) {
      console.error("JSON ERROR:", e);
      return errorResponse(res, 500, 'Invalid JSON structure received from AI based on the resume.');
    }

    return successResponse(res, 200, parsedData, 'Radar analysis completed successfully.');

  } catch (error) {
    console.error('Radar Analysis Error:', error);
    
    // Check if it's a Rate Limit error
    if (error.status === 429 || error?.message?.includes('429') || error?.message?.includes('Quota exceeded')) {
      console.warn("⚠️ GEMINI RATE LIMIT REACHED: Using fallback mock data so the app won't break for the demo.");
      
      const mockData = {
        match_score: 75,
        user_skills: [
          { name: "JavaScript", level: 85 },
          { name: "React", level: 80 },
          { name: "HTML/CSS", level: 90 },
          { name: "Node.js", level: 60 }
        ],
        missing_skills: [
          { name: "System Design", priority: "high" },
          { name: "TypeScript", priority: "high" },
          { name: "CI/CD Pipelines", priority: "medium" },
          { name: "GraphQL", priority: "medium" },
          { name: "Dockerized Deployments", priority: "medium" },
          { name: "Cloud Services (AWS/GCP)", priority: "low" },
          { name: "Unit/Integration Testing", priority: "high" },
          { name: "Microservices Architecture", priority: "high" }
        ],
        gap_analysis: [
          { skill: "System Design", gap: 60, priority: "high" },
          { skill: "TypeScript", gap: 50, priority: "high" },
          { skill: "Unit Testing", gap: 45, priority: "high" },
          { skill: "Docker/Containers", gap: 30, priority: "medium" },
          { skill: "Advanced APIs (GraphQL)", gap: 20, priority: "medium" }
        ],
        resume_improvement: {
          original_summary: "Experienced developer looking for new roles.",
          improved_summary: "Results-driven Software Engineer with solid expertise in modern JavaScript frameworks (React, Node.js), demonstrating a strong capability in building scalable web applications. Eager to leverage skills in a dynamic full-stack environment.",
          improved_points: [
            "Quantify your achievements (e.g., 'Improved load time by 30%').",
            "Highlight specific testing frameworks used (e.g., Jest, Cypress).",
            "Include stronger action verbs like 'Architected', 'Spearheaded', and 'Orchestrated'."
          ]
        },
        job_matches: [
          {
            title: "Senior Frontend Developer",
            match: 80,
            missing_skills: ["TypeScript", "Advanced Testing"]
          },
          {
            title: "Full Stack Software Engineer",
            match: 60,
            missing_skills: ["System Design", "Cloud Infrastructure"]
          }
        ],
        roadmap: [
          {
            week: 1,
            focus: "TypeScript Fundamentals & Migration",
            tasks: ["Learn Types, Interfaces, & Generics", "Migrate a small React project to TypeScript", "Understand utility types"]
          },
          {
            week: 2,
            focus: "System Design & Architecture Basics",
            tasks: ["Study scaling techniques (Horizontal vs Vertical)", "Learn Load Balancing & Caching strategies", "Design a URL shortener backend"]
          },
          {
            week: 3,
            focus: "Software Testing Practices",
            tasks: ["Set up Jest in a Node project", "Write unit tests for core utilities", "Implement API integration testing"]
          },
          {
            week: 4,
            focus: "Containerization & DevOps",
            tasks: ["Learn Docker core concepts (Containers, Images, Volumes)", "Dockerize a Node.js + React application", "Write basic GitHub Actions CI/CD workflows"]
          },
          {
             week: 5,
             focus: "Advanced APIs & Microservices",
             tasks: ["Understand GraphQL vs REST", "Build a small GraphQL abstraction layer", "Explore microservice communication patterns"]
          }
        ],
        summary: "You have an excellent core foundation! Focus primarily on System Design, TypeScript, and modern DevOps practices (Docker, CI/CD) to be fully competitive for senior roles and higher-paying tech jobs."
      };
      
      return successResponse(res, 200, mockData, 'Radar analysis completed (Fallback Data due to API limit).');
    }

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
    
    if (error.status === 429 || error?.message?.includes('429') || error?.message?.includes('Quota exceeded')) {
      console.warn("⚠️ GEMINI RATE LIMIT REACHED: Using fallback roadmap data.");
      
      const mockRoadmap = {
        total_duration: "90 days",
        phases: [
          {
            phase_name: "Phase 1: Advanced Languages & Abstractions",
            duration: "20 days",
            focus_skills: ["TypeScript", "GraphQL"],
            tasks: [
              "Master advanced JS concepts (Event Loop, Closures)", 
              "Convert a primary side project to TypeScript strictly",
              "Replace a REST API endpoint with a GraphQL resolver"
            ],
            goal: "Solidify language fundamentals and modern communication layers"
          },
          {
            phase_name: "Phase 2: System Design & Scalability",
            duration: "25 days",
            focus_skills: ["System Architecture", "Microservices", "Caching"],
            tasks: [
              "Study system design case studies (Netflix, Uber)", 
              "Implement Redis caching in a Node.js API",
              "Design a scalable microservices architecture on paper"
            ],
            goal: "Learn how to build software that scales to millions of users"
          },
          {
            phase_name: "Phase 3: DevOps & Containerization",
            duration: "20 days",
            focus_skills: ["Docker", "CI/CD Pipelines", "AWS/GCP Basics"],
            tasks: [
              "Containerize your full-stack app with Docker Compose", 
              "Set up an automated testing pipeline using GitHub Actions",
              "Deploy a simple container to a cloud provider"
            ],
            goal: "Ship reliable software automatically and isolate environments"
          },
          {
            phase_name: "Phase 4: Quality & Testing",
            duration: "15 days",
            focus_skills: ["Jest", "Cypress", "TDD"],
            tasks: [
              "Write unit tests for completely untested business logic", 
              "Set up Cypress for end-to-end frontend testing",
              "Achieve 70%+ coverage on a small service"
            ],
            goal: "Ensure high code quality and prevent production regressions"
          },
          {
            phase_name: "Phase 5: Interview & Portfolio Polish",
            duration: "10 days",
            focus_skills: ["DSA", "System Design Mocking", "Behavioral"],
            tasks: [
              "Solve 2 medium LeetCode problems daily", 
              "Do mock interviews with a peer or AI",
              "Update resume with quantified architectural improvements"
            ],
            goal: "Crack senior-level technical interviews confidently"
          }
        ]
      };
      
      return successResponse(res, 200, mockRoadmap, 'Roadmap generated successfully (Fallback Data).');
    }

    return errorResponse(res, 500, 'Failed to generate roadmap with AI. ' + (error.message || ''));
  }
});

module.exports = { uploadAndExtract, radarAnalysis, generateRoadmap };
