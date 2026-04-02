import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey there! 👋 I'm your learning companion. I'm here to motivate you and help guide your journey to your dream job! How can I support you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    "What is GapFinder?",
    "Show my skills",
    "Roadmap help",
    "Motivate me!"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase().trim();

    // Greeting patterns
    if (input.match(/\b(hi|hello|hey|greetings|good morning|good evening)\b/)) {
      return "Hello! 🌟 Great to see you here! You're one step closer to your dream job. What would you like to know?";
    }

    // GapFinder/Project related
    if (input.match(/\b(what is|tell me about|explain|gapfinder|this project|this app|what does)\b/)) {
      return "GapFinder is your personal career companion! 🎯 We analyze the gap between your current skills and your dream job, then create a personalized 30-90 day roadmap to bridge that gap. Think of me as your GPS for career success!";
    }

    // Skills related
    if (input.match(/\b(skills|skill gap|my skills|what skills|learn)\b/)) {
      return "Your skills are your superpower! 💪 Head to the Dashboard to see your current skills, identify gaps, and track your progress. Remember: every expert was once a beginner. You've got this!";
    }

    // Roadmap related
    if (input.match(/\b(roadmap|plan|timeline|learning path|30.*90|days)\b/)) {
      return "Your personalized roadmap is your success blueprint! 🗺️ It breaks down your journey into 30-day phases with clear milestones. Check your Dashboard for your custom plan. Small steps lead to big achievements!";
    }

    // Motivation
    if (input.match(/\b(motivate|motivation|inspire|encourage|difficult|hard|struggle|give up)\b/)) {
      return "Listen, you're amazing for being here! 🌟 Every line of code you write, every concept you learn, is a step toward your dream. The journey might be challenging, but YOU are capable of incredible things. Keep pushing forward—your future self will thank you! 💪✨";
    }

    // Progress/Tracking
    if (input.match(/\b(progress|track|score|readiness|how am i doing)\b/)) {
      return "Your progress is looking great! 📈 Check your Dashboard for your Job Readiness Score and detailed progress tracking. Every percentage point is a victory. Celebrate your wins, no matter how small!";
    }

    // Courses/Learning
    if (input.match(/\b(course|courses|udemy|coursera|learn|study|tutorial|resources)\b/)) {
      return "We've curated the best courses just for YOU! 📚 Check the Dashboard for personalized course recommendations based on your skill gaps. Quality learning resources + your dedication = unstoppable combo!";
    }

    // React/Frontend
    if (input.match(/\b(react|frontend|javascript|js|html|css|web development)\b/)) {
      return "Frontend development is an awesome choice! 🎨 Start with HTML/CSS mastery, then dive deep into JavaScript. React comes next—it's powerful and in high demand. Practice by building real projects. You're on the right path!";
    }

    // Backend
    if (input.match(/\b(backend|node|nodejs|express|api|server|database)\b/)) {
      return "Backend skills are crucial! 🔧 Focus on Node.js and Express for building APIs, then master databases like MongoDB or PostgreSQL. Start with simple CRUD operations and level up from there. The backend world needs talented developers like you!";
    }

    // Job/Career
    if (input.match(/\b(job|career|hire|interview|work|employment|get hired)\b/)) {
      return "Landing your dream job is absolutely within reach! 🎯 Focus on building your skills, creating a strong portfolio, and networking. Check your Job Readiness Score to see how close you are. You're building something incredible—employers will see that!";
    }

    // Time/Duration
    if (input.match(/\b(how long|duration|time|when|fast)\b/)) {
      return "Our roadmap is designed for 30-90 days, but remember: this is YOUR journey! ⏱️ Some people move faster, others take more time—both are perfectly fine. Consistency beats speed every time. Focus on daily progress, not perfection!";
    }

    // Help/Commands
    if (input.match(/\b(help|commands|what can you do|features)\b/)) {
      return "I'm here to help you succeed! 🤝 Ask me about:\n• GapFinder features\n• Your skills & progress\n• Learning roadmap\n• Course recommendations\n• Motivation & tips\n• Career advice\n\nWhat would you like to know?";
    }

    // Thanks
    if (input.match(/\b(thank|thanks|appreciate|grateful)\b/)) {
      return "You're so welcome! 😊 I'm honored to be part of your journey. Remember, I'm always here when you need guidance or a motivational boost. Keep crushing it! 🚀";
    }

    // Fallback response
    const fallbackResponses = [
      "That's a great question! 🤔 While I'm still learning, I can help you with skill gaps, roadmaps, and motivation. Try asking about your learning path or check out the Dashboard for detailed insights!",
      "I want to help you succeed! 🌟 Ask me about your skills, roadmap, or how GapFinder works. Or head to the Dashboard to explore your personalized journey!",
      "Hmm, I'm not quite sure about that, but I'm here to support your learning journey! 💡 Try asking about your skill gaps, progress tracking, or course recommendations."
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const handleSend = (text = null) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setShowQuickReplies(false);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          data-testid="chatbot-open-button"
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-indigo-600 to-violet-600 p-4 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_rgba(99,102,241,0.7)] transition-all duration-300 group"
        >
          <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          data-testid="chatbot-window"
          className="fixed bottom-6 right-6 w-[90vw] sm:w-96 h-[600px] max-h-[80vh] z-50 bg-[#12141D]/60 backdrop-blur-xl border border-indigo-500/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-indigo-600/20 border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
                  Learning Assistant
                </h3>
                <p className="text-xs text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  Always here to help
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              data-testid="chatbot-close-button"
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                data-testid={`chat-message-${message.sender}`}
              >
                <div
                  className={`${
                    message.sender === 'bot'
                      ? 'bg-white/10 rounded-2xl rounded-tl-sm text-slate-200'
                      : 'bg-indigo-600 rounded-2xl rounded-tr-sm text-white'
                  } p-3 max-w-[85%] text-sm whitespace-pre-line`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {/* Quick Replies */}
            {showQuickReplies && messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 mt-2" data-testid="quick-replies">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(reply)}
                    data-testid={`quick-reply-${index}`}
                    className="text-xs border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/30 text-indigo-300 rounded-full px-3 py-1.5 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                data-testid="chatbot-input"
                className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              />
              <button
                onClick={() => handleSend()}
                data-testid="chatbot-send-button"
                className="bg-indigo-600 hover:bg-indigo-500 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inputText.trim()}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;