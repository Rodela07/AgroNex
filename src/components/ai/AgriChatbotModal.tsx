import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles, 
  AlertTriangle, 
  RotateCcw, 
  ChevronRight, 
  Sprout, 
  Beef, 
  Fish, 
  TrendingUp, 
  Globe,
  Maximize2,
  Minimize2,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage, getAgriAiResponse } from '../../services/agriAiService';

interface AgriChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string, subtab?: string) => void;
  initialQuery?: string;
}

export const AgriChatbotModal: React.FC<AgriChatbotModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  initialQuery
}) => {
  const { language, setLanguage, showToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome_1',
      sender: 'ai',
      text: language === 'bn'
        ? `আসসালামু আলাইকুম! আমি এগ্রোনেক্সের কৃত্রিম বুদ্ধিমত্তা সম্পন্ন কৃষি সহকারী।
ফসল চাষ, সার প্রয়োগ মাত্রা, পশু-পাখির রোগ ও চিকিৎসা, মাছের পুকুর পরিচর্যা কিংবা আজকের পাইকারি বাজারদর সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারেন। নিচের বোতামগুলোতে চাপ দিয়েও প্রশ্ন করতে পারেন!`
        : `Welcome! I am your AgroNex AI Agriculture Advisor.
Ask me anything regarding crops, BARC fertilizer dosages, livestock diseases, fish pond water quality, or wholesale regional market prices in plain Bangla or English.`,
      timestamp: 'এখন'
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // Handle initial query if passed
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, [initialQuery]);

  // Read aloud helper (TTS)
  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS not supported or blocked by browser', e);
    }
  };

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Realistic typing delay for AI response
    setTimeout(() => {
      const response = getAgriAiResponse(queryText, language);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: response.isEmergency,
        actionCard: response.actionCard
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);

      if (speechEnabled) {
        speakText(response.reply);
      }
    }, 600);
  };

  const handleVoiceInputSimulate = () => {
    if (!isListening) {
      setIsListening(true);
      showToast(
        language === 'bn' ? 'মাইক্রোফোন সক্রিয়...' : 'Listening...',
        'info',
        language === 'bn' ? 'আপনার প্রশ্নটি বলুন (যেমন: ধানের ব্লাস্ট রোগ)' : 'Speak your question now'
      );

      // Simulate voice capture
      setTimeout(() => {
        setIsListening(false);
        const sampleVoiceQueries = language === 'bn' ? [
          'বোরো ধানের সার প্রয়োগ মাত্রা কত?',
          'আলুর নাবি ধসা রোগ হলে কি করব?',
          'পুকুরে ভোরে মাছ ভেসে উঠছে কেন?',
          'গাভীর দুধ বৃদ্ধির সহজ খাবার কি?'
        ] : [
          'What is the fertilizer dose for Boro rice?',
          'How to treat potato late blight?',
          'Why are fish gasping at the pond surface?'
        ];
        const randomQuery = sampleVoiceQueries[Math.floor(Math.random() * sampleVoiceQueries.length)];
        setInput(randomQuery);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleResetChat = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setMessages([
      {
        id: `reset_${Date.now()}`,
        sender: 'ai',
        text: language === 'bn'
          ? 'কথোপকথন পরিষ্কার করা হয়েছে। যেকোনো নতুন কৃষি প্রশ্ন করতে পারেন।'
          : 'Chat history cleared. Feel free to ask any agricultural question.',
        timestamp: 'এখন'
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div 
        className={`bg-white w-full flex flex-col shadow-2xl transition-all duration-200 overflow-hidden ${
          isFullScreen 
            ? 'h-full max-h-screen rounded-none' 
            : 'h-[90vh] sm:h-[620px] max-w-2xl sm:rounded-3xl border border-softBorder'
        }`}
      >
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-forest to-forest-dark text-white p-3.5 sm:p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white">
                <Bot className="w-6 h-6 text-forest-leaf" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-forest rounded-full" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  {language === 'bn' ? 'কৃষি এআই সহকারী (Agri AI)' : 'Agri AI Smart Assistant'}
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-forest-leaf/25 text-forest-leaf border border-forest-leaf/40">
                  ২৪/৭ সক্রিয়
                </span>
              </div>
              <p className="text-[11px] text-rice/75 mt-0.5">
                {language === 'bn' ? 'বাংলা ও ইংরেজিতে কৃষি, পশু ও মাছের সমাধান' : 'Bilingual crop, livestock & fisheries intelligence'}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            {/* Read aloud toggle */}
            <button
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                if (speechEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`p-2 rounded-xl transition ${speechEnabled ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'}`}
              title={speechEnabled ? (language === 'bn' ? 'ভয়েস বন্ধ করুন' : 'Mute voice') : (language === 'bn' ? 'ভয়েস চালু করুন' : 'Enable voice')}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4 text-forest-leaf" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Language toggle inside chat */}
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-xs font-bold transition flex items-center space-x-1"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Clear chat */}
            <button
              onClick={handleResetChat}
              className="p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition"
              title={language === 'bn' ? 'নতুন করে শুরু' : 'Clear Chat'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fullscreen toggle (desktop only) */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="hidden sm:inline-flex p-2 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close button */}
            <button
              onClick={() => {
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suggestion Pills Banner for Basic-Level Users */}
        <div className="bg-forest-50/70 border-b border-softBorder px-3.5 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-bold text-forest shrink-0 flex items-center space-x-1 mr-1">
            <Sparkles className="w-3 h-3 text-harvest-dark" />
            <span>{language === 'bn' ? 'সহজ প্রশ্নসমূহ:' : 'Quick Questions:'}</span>
          </span>

          {[
            { bn: 'বোরো ধানের সার প্রয়োগ মাত্রা?', en: 'Boro rice fertilizer dose?' },
            { bn: 'আলুর নাবি ধসা রোগের প্রতিকার?', en: 'How to control potato late blight?' },
            { bn: 'পুকুরে সকালে মাছ ভেসে উঠছে কেন?', en: 'Fish gasping at pond surface?' },
            { bn: 'গাভীর দুধ বৃদ্ধির সহজ উপায়?', en: 'How to increase dairy milk yield?' },
            { bn: 'আজকের পাইকারি বাজারদর কেমন?', en: 'Today\'s wholesale market rates?' },
            { bn: '🚨 ক্ষুরারোগের লক্ষণ ও করণীয়?', en: '🚨 FMD disease emergency actions?' }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(language === 'bn' ? item.bn : item.en)}
              className="px-2.5 py-1 rounded-xl bg-white border border-forest/20 text-[11px] font-medium text-forest-dark hover:bg-forest hover:text-white hover:border-forest transition whitespace-nowrap shadow-2xs shrink-0 active:scale-95"
            >
              {language === 'bn' ? item.bn : item.en}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-rice/40">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5 animate-in fade-in duration-150`}
              >
                <div className="flex items-center space-x-2 text-[10px] text-mutedText px-1">
                  <span>{isUser ? (language === 'bn' ? 'আপনি' : 'You') : (language === 'bn' ? 'এগ্রোনেক্স এআই' : 'AgroNex AI')}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div 
                  className={`max-w-[88%] sm:max-w-[80%] p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                    isUser 
                      ? 'bg-forest text-white rounded-tr-xs font-medium' 
                      : 'bg-white text-primaryText border border-softBorder rounded-tl-xs space-y-2.5'
                  }`}
                >
                  {/* Emergency Warning Badge */}
                  {msg.isEmergency && (
                    <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-status-error flex items-center space-x-1.5 text-xs font-bold mb-1">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{language === 'bn' ? 'জরুরি রোগ সংকট সনাক্ত হয়েছে!' : 'Critical Agricultural Emergency Detected!'}</span>
                    </div>
                  )}

                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Read Aloud button on individual response */}
                  {!isUser && (
                    <div className="pt-2 border-t border-softBorder/60 flex items-center justify-between text-[11px] text-secondaryText">
                      <button
                        onClick={() => speakText(msg.text)}
                        className="inline-flex items-center space-x-1 text-forest hover:underline font-bold"
                        title="পড়ে শোনান"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'পড়ে শোনান' : 'Listen'}</span>
                      </button>

                      <span className="text-[10px] text-mutedText">
                        {language === 'bn' ? 'বিএআরসি ও ডিএই নির্দেশিকা' : 'BARC & DAE Verified'}
                      </span>
                    </div>
                  )}

                  {/* Action Link Card */}
                  {msg.actionCard && onNavigate && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          onNavigate(msg.actionCard!.tab, msg.actionCard!.subtab);
                          onClose();
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-forest-50 hover:bg-forest-100/80 border border-forest/20 text-forest-dark text-xs font-bold transition group"
                      >
                        <span className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-forest" />
                          <span>{language === 'bn' ? msg.actionCard.labelBn : msg.actionCard.labelEn}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Bouncing Dots */}
          {isTyping && (
            <div className="flex items-center space-x-2 p-3 rounded-2xl bg-white border border-softBorder max-w-[120px] text-forest">
              <Bot className="w-4 h-4 animate-bounce" />
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse delay-100" />
                <span className="w-1.5 h-1.5 bg-forest rounded-full animate-pulse delay-200" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Form */}
        <div className="p-3 sm:p-4 bg-white border-t border-softBorder">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }} 
            className="flex items-center space-x-2"
          >
            {/* Voice Simulation Button */}
            <button
              type="button"
              onClick={handleVoiceInputSimulate}
              className={`p-2.5 sm:p-3 rounded-2xl transition shrink-0 active:scale-95 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-rice text-secondaryText hover:text-forest hover:bg-forest-50 border border-softBorder'
              }`}
              title={language === 'bn' ? 'মুখে বলে প্রশ্ন করুন' : 'Voice Query'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'bn' 
                  ? 'যেকোনো কৃষি বা খামারের প্রশ্ন লিখুন (যেমন: আলুর রোগ, ধানের সার)...' 
                  : 'Type your farming question (e.g. Rice neck blast, potato fertilizer)...'
              }
              className="input-field py-3 text-xs sm:text-sm font-medium flex-1 rounded-2xl"
            />

            {/* Submit Send Button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-primary p-2.5 sm:p-3 rounded-2xl shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95"
              title={language === 'bn' ? 'পাঠান' : 'Send'}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-[10px] text-center text-mutedText mt-2">
            {language === 'bn' 
              ? 'কৃষি তথ্য বিএআরসি ও কৃষি সম্প্রসারণ অধিদপ্তর দ্বারা যাচাইকৃত।' 
              : 'Agricultural intelligence verified by BARC and DAE.'}
          </p>
        </div>

      </div>
    </div>
  );
};
