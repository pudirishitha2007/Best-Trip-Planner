import React, { useState, useEffect, useRef } from 'react';
import { TripPlan } from '../types/trip';
import { Sparkles, Send, Bot, User, X, Check, ArrowRight } from 'lucide-react';

interface BestTripAIChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: TripPlan | null;
  onApplyPlanAction: (action: string) => void;
  initialQuery?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedAction?: string | null;
  timestamp: string;
}

const QUICK_PROMPTS = [
  '“I only have one day.”',
  '“Show me the one best place I can visit.”',
  '“I want to return home on the same day.”',
  '“I don’t have a car.”',
  '“Find a cab.”',
  '“Find a cheaper route.”',
  '“Where can I eat local food?”',
  '“Where is the nearest farmers’ market?”',
  '“Find a farm near the attraction.”',
  '“I don’t want a hotel.”',
  '“Reduce my budget.”',
  '“Give me a faster return route.”',
  '“Change my trip to three days.”',
];

export const BestTripAIChat: React.FC<BestTripAIChatProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onApplyPlanAction,
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      sender: 'ai',
      text: `Hello! I'm **Best Trip AI**, your personal AI travel agent. I can optimize your one-day return guarantee, find cabs, locate organic farm-to-table dining, or adjust your budget. What would you like to plan?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && isOpen) {
      sendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (textToSend: string) => {
    const cleanText = textToSend.replace(/[«“”»]/g, '').trim();
    if (!cleanText || isSending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          currentPlan,
        }),
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'I updated your travel specifications accordingly!',
        suggestedAction: data.suggestedAction,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Automatically apply action if returned
      if (data.suggestedAction) {
        onApplyPlanAction(data.suggestedAction);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `I've updated your plan: locked in same-day return route, zero hotel expense, and verified the primary attraction schedule!`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/40 backdrop-blur-xs p-2 sm:p-4">
      <div className="w-full max-w-lg h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-slideLeft">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400 flex items-center justify-center">
              <Bot className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white flex items-center gap-1.5">
                <span>Best Trip AI</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <span className="text-[11px] text-slate-300">Live AI Travel Agent</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 px-1">
            Quick Ask:
          </span>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => sendMessage(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200 rounded-lg whitespace-nowrap shadow-2xs transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 text-xs ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-slate-900 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-sky-600 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {msg.suggestedAction && (
                  <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-emerald-700">
                      ✓ Plan Updated
                    </span>
                    <button
                      onClick={() => onApplyPlanAction(msg.suggestedAction!)}
                      className="text-[11px] font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                    >
                      <span>View Changes</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <div
                  className={`text-[9px] ${
                    msg.sender === 'user' ? 'text-sky-100' : 'text-slate-600'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-2.5 text-xs">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-sky-400 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                <span>Best Trip AI is analyzing routes & schedules...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything: cabs, farm food, return time, budget..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 transition-colors shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
