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

module.exports = { uploadAndExtract, radarAnalysis };
