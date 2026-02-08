import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { generateContent } from '../../lib/openrouter';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// College Knowledge Base for AI context
const COLLEGE_INFO = `
INCPUC (Indian National Composite Pre-University College) Information:

**Location:** 
- Address: 123 Education Lane, Jayanagar, Bangalore, Karnataka - 560041
- Near Jayanagar 4th Block Metro Station
- Office Hours: Mon-Sat, 9 AM - 5 PM

**Courses Offered:**
1. Science (PCMB) - Physics, Chemistry, Mathematics, Biology
   - For Medical/Research aspirants
   - Eligibility: 75% in 10th
   - Fees: ₹45,000/year
   
2. Science (PCMC) - Physics, Chemistry, Mathematics, Computer Science
   - For Engineering/IT aspirants
   - Eligibility: 75% in 10th
   - Fees: ₹45,000/year

3. Commerce (CEBA) - Computer Science, Economics, Business Studies, Accountancy
   - For CA/MBA aspirants
   - Eligibility: 60% in 10th
   - Fees: ₹35,000/year

**Facilities:**
- Well-equipped laboratories
- Digital library
- Sports facilities
- AC classrooms
- Cafeteria

**Timings:**
- Classes: 8:00 AM - 3:30 PM
- Library: 8:00 AM - 6:00 PM

**Contact:**
- Phone: +91-80-2345-6789
- Email: info@incpuc.edu.in
- Website: www.incpuc.edu.in

**Admission Process:**
1. Fill application form online
2. Team contacts within 48 hours
3. Visit campus with documents
4. Complete payment & enrollment

**Required Documents:**
- 10th Mark Sheet
- Transfer Certificate
- 3 Passport Photos

**Scholarships:**
- Merit: Up to 50% for 90%+ in 10th
- Sports: Up to 25% for state-level athletes
- Sibling: 10% discount

**Results (2025):**
- 98%+ pass rate
- 65%+ distinction rate
- 10+ university ranks

Always be helpful, friendly, and encourage students to apply. If asked about something not mentioned, politely redirect to the contact number.
`;

// Quick action buttons
const quickActions = ['Fees', 'Courses', 'Admissions', 'Location', 'Scholarships'];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! 👋 I\'m the INCPUC AI Assistant powered by advanced AI. I can answer any questions about our college, courses, admissions, and more!\n\nHow can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      // Call OpenRouter AI with college context
      const result = await generateContent(
        userInput,
        `You are a helpful AI assistant for INCPUC (Pre-University College) in Bangalore. 
        
Use ONLY the following college information to answer questions. Be friendly, concise, and helpful. 
If asked about something not in the info, politely say you don't have that information and suggest contacting the office.
Format responses with clear structure when appropriate. Keep responses brief but informative.

${COLLEGE_INFO}`
      );

      let responseText: string;

      if (result.success && result.content) {
        responseText = result.content;
      } else {
        // Fallback response if AI fails
        responseText = `I'm having trouble connecting right now. Here's what I can tell you:

**Quick Info:**
📞 Phone: +91-80-2345-6789
📧 Email: info@incpuc.edu.in
📍 Location: Jayanagar, Bangalore

Try asking about:
• Fees & payments
• Courses offered
• Admission process
• Eligibility criteria

Or call our Front Office for immediate assistance!`;
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I encountered an error. Please try again or contact our office at +91-80-2345-6789.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 ${isOpen ? 'hidden' : 'flex'
          } items-center justify-center`}
        aria-label="Open AI chatbot"
      >
        <Sparkles className="size-6" aria-hidden="true" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-card rounded-xl shadow-2xl border border-border flex flex-col"
          style={{ height: '600px', maxHeight: '80vh' }}
          role="dialog"
          aria-label="AI Chatbot"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">INCPUC AI Assistant</h3>
                <p className="text-xs text-white/80">
                  {isTyping ? 'Thinking...' : 'Powered by AI'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close chatbot"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.sender === 'user'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    }`}
                  aria-hidden="true"
                >
                  {message.sender === 'user' ? (
                    <User className="size-4" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                </div>
                <div
                  className={`flex-1 max-w-[80%] ${message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${message.sender === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                  <p className="text-xs text-muted mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                  <Bot className="size-4" />
                </div>
                <div className="bg-secondary text-secondary-foreground p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isTyping ? 'AI is thinking...' : 'Ask me anything...'}
                disabled={isTyping}
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Chat message"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                {isTyping ? (
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
