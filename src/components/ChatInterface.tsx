/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, ShoppingBag } from "lucide-react";
import Markdown from "react-markdown";
import { cn } from "@/src/lib/utils";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function ChatInterface({ messages, onSendMessage, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] border border-neutral-200 rounded-2xl bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-bottom border-neutral-100 flex items-center gap-3 bg-neutral-50/50">
        <div className="p-2 bg-neutral-900 rounded-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Design Consultant</h3>
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">AI Powered Refinement</p>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 gap-3">
            <Sparkles className="w-8 h-8 opacity-20" />
            <p className="text-sm">Ask about refinements or shoppable items</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === "user" ? "ml-auto flex-row-reverse text-right" : "mr-auto"
            )}
          >
            <div className={cn(
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              msg.role === "user" ? "bg-neutral-100" : "bg-neutral-900 text-white"
            )}>
              {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === "user" 
                ? "bg-neutral-900 text-white rounded-tr-none" 
                : "bg-neutral-50 text-neutral-800 rounded-tl-none border border-neutral-100"
            )}>
              <div className="markdown-body prose prose-sm prose-neutral max-w-none">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center animate-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl rounded-tl-none border border-neutral-100 italic text-neutral-400 text-sm">
              Analyzing design...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-100 bg-neutral-50/30">
        <div className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 'Keep this but make the rug blue...'"
            className="w-full pl-5 pr-12 py-3 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/5 focus:border-neutral-900 transition-all text-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-neutral-900 text-white disabled:bg-neutral-200 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
