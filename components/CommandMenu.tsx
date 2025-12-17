import React, { useEffect, useState, useRef } from 'react';
import { Command, Sparkles, X, Loader2 } from 'lucide-react';
import { summarizeContent } from '../services/geminiService';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  documentContent: string;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, onClose, documentContent }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setResult(null);
      setQuery('');
    }
  }, [isOpen]);

  const handleAction = async () => {
    if (!documentContent) return;
    setLoading(true);
    const summary = await summarizeContent(documentContent);
    setResult(summary);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Input Area */}
        <div className="flex items-center border-b border-zinc-800 p-3 gap-3">
          <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-500 text-sm h-6"
            placeholder="Ask AI to summarize or edit..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAction();
              if (e.key === 'Escape') onClose();
            }}
          />
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-800 rounded border border-zinc-700 font-mono">
              ESC
            </kbd>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto min-h-[100px] p-2">
          {loading ? (
             <div className="flex items-center justify-center h-24 text-zinc-500 gap-2">
               <Loader2 className="animate-spin" size={18} />
               <span className="text-sm">Thinking...</span>
             </div>
          ) : result ? (
            <div className="p-2 space-y-2">
               <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Summary</h3>
               <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                 {result}
               </div>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              <div className="px-2 mb-1 text-xs font-medium text-zinc-600 uppercase">Suggestions</div>
              <button 
                onClick={handleAction}
                className="w-full text-left px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md flex items-center justify-between group transition-colors"
              >
                <span>Summarize this document</span>
                <span className="text-xs text-zinc-600 group-hover:text-zinc-400">Cmd+Enter</span>
              </button>
              <button className="w-full text-left px-2 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md transition-colors opacity-50 cursor-not-allowed">
                <span>Fix spelling and grammar (Soon)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-2 bg-zinc-950/50 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between px-4">
           <span>Powered by Gemini 2.5 Flash</span>
           <span>LinearFlow AI</span>
        </div>
      </div>
    </div>
  );
};