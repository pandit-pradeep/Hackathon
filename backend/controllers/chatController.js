const { GoogleGenAI } = require('@google/genai');

const getChatResponse = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.' 
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { message, history } = req.body;

    // Convert old custom history to Gemini required format
    const contents = history && history.length > 0 ? history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) : [];

    // Skip pushing the current message separately if the history already includes it from the frontend!
    // We will assume frontend sends the history that DOES NOT include the current message.
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are the Learning Assistant for Gap-Finder, an app that analyzes the gap between a user's skills and their dream job. You give helpful career advice, course links, encouragement, and clear milestones. Maintain a friendly, motivational, and futuristic SaaS tone. Use emojis naturally. Do not output markdown code blocks unless writing real code snippets.",
        temperature: 0.7,
      }
    });

    res.status(200).json({
      success: true,
      data: response.text
    });

  } catch (error) {
    console.error('Chat AI Error:', error);
    res.status(500).json({ success: false, message: 'AI Service failed. Please check the API key and try again.'});
  }
};

module.exports = { getChatResponse };
