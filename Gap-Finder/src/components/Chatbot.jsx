import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import api from '../utils/api';

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

  const handleSend = async (text = null) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setShowQuickReplies(false);

    try {
      const historyPayload = messages.map(m => ({ sender: m.sender, text: m.text }));
      const response = await api.post('/chat', {
        message: messageText,
        history: historyPayload
      });

      if (response.data.success) {
        setMessages((prev) => [...prev, {
          id: Date.now() + 1,
          text: response.data.data,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: err.response?.data?.message || 'Oops, I am having trouble connecting to my AI brain. Make sure your API key is configured!',
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
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