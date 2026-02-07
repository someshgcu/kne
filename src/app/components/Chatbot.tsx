import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { chatbotKnowledge } from '../../data/mockData';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m INCPUC Assistant. I can help you with information about fees, admissions, facilities, and more. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Fee-related queries
    if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      if (lowerMessage.includes('science')) {
        return chatbotKnowledge.fees.science;
      } else if (lowerMessage.includes('commerce')) {
        return chatbotKnowledge.fees.commerce;
      }
      return `${chatbotKnowledge.fees.science}\n\n${chatbotKnowledge.fees.commerce}`;
    }

    // Admission-related queries
    if (lowerMessage.includes('admission') || lowerMessage.includes('apply') || lowerMessage.includes('eligibility')) {
      if (lowerMessage.includes('eligibility') || lowerMessage.includes('eligible')) {
        return chatbotKnowledge.admissions.eligibility;
      } else if (lowerMessage.includes('process') || lowerMessage.includes('how')) {
        return chatbotKnowledge.admissions.process;
      } else if (lowerMessage.includes('deadline') || lowerMessage.includes('last date')) {
        return chatbotKnowledge.admissions.deadlines;
      }
      return `${chatbotKnowledge.admissions.eligibility}\n\n${chatbotKnowledge.admissions.process}`;
    }

    // Facility queries
    if (lowerMessage.includes('facilit') || lowerMessage.includes('lab') || lowerMessage.includes('library') || lowerMessage.includes('sports')) {
      return chatbotKnowledge.facilities;
    }

    // Contact queries
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('address')) {
      return chatbotKnowledge.contact;
    }

    // Timing queries
    if (lowerMessage.includes('timing') || lowerMessage.includes('time') || lowerMessage.includes('hours') || lowerMessage.includes('open')) {
      return chatbotKnowledge.timings;
    }

    // Default response
    return "I can help you with information about:\n\n• Fees and costs\n• Admission process and eligibility\n• Facilities and infrastructure\n• Contact information\n• College timings\n\nPlease ask me anything about these topics!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot thinking delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-accent text-accent-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 ${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center`}
        aria-label="Open chatbot"
      >
        <MessageCircle className="size-6" aria-hidden="true" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-card rounded-xl shadow-2xl border border-border flex flex-col"
          style={{ height: '600px', maxHeight: '80vh' }}
          role="dialog"
          aria-label="Chatbot"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="bg-accent text-accent-foreground p-2 rounded-full">
                <Bot className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold">INCPUC Assistant</h3>
                <p className="text-xs text-primary-foreground/80">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors"
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
                className={`flex gap-3 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-secondary-foreground'
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
                  className={`flex-1 max-w-[80%] ${
                    message.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      message.sender === 'user'
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
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent bg-background text-foreground"
                aria-label="Chat message"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
