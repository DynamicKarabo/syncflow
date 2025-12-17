import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Presence } from './components/Presence';
import { CommandMenu } from './components/CommandMenu';
import { CursorChatOverlay } from './components/CursorChatOverlay';
import { useGhost } from './hooks/useGhost';
import { Room, User } from './types';
import { Command as CommandIcon, MoreHorizontal, Bot, Sparkles } from 'lucide-react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';

// Mock Rooms
const MOCK_ROOMS: Room[] = [
  { id: 'default', name: 'General Collaboration', isActive: true },
  { id: 'planning', name: 'Q3 Planning', isActive: false },
];

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#34d399', '#22d3ee', '#818cf8', '#c084fc', '#f472b6'];
const NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Quinn', 'Riley', 'Avery'];

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const App: React.FC = () => {
  const [activeRoomId, setActiveRoomId] = useState('default');
  const [content, setContent] = useState('');
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Ghost State
  const [isGhostEnabled, setIsGhostEnabled] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Initialize User Identity
  const currentUser = useMemo<User>(() => ({
    id: Math.random().toString(36).substr(2, 9),
    name: getRandomElement(NAMES),
    color: getRandomElement(COLORS),
    status: 'active'
  }), []);

  // Initialize Yjs
  const [yjsState, setYjsState] = useState<{ doc: Y.Doc; provider: HocuspocusProvider } | null>(null);

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: 'ws://127.0.0.1:1234',
      name: activeRoomId, // Sync based on room ID
      document: doc,
    });
    // @ts-ignore
    provider.doc = doc;

    const handleStatus = ({ status }: { status: string }) => {
      setIsConnected(status === 'connected');
    };

    provider.on('status', handleStatus);
    provider.on('synced', () => { /* Synced */ });

    // Set initial state
    setYjsState({ doc, provider });
    setIsConnected(provider.status === 'connected');

    return () => {
      provider.disconnect();
      doc.destroy();
      setYjsState(null);
    };
  }, [activeRoomId]);

  // Derived state to keep the rest of the app working with minimal changes
  const doc = yjsState?.doc || null;
  const provider = yjsState?.provider || null;

  // Ghost Hook
  useGhost({
    mainDoc: doc,
    provider: provider,
    isEnabled: isGhostEnabled,
    onSuggestion: (text) => setSuggestions(prev => [text, ...prev].slice(0, 3))
  });

  // Ghost Hook
  useGhost({
    mainDoc: doc,
    provider: provider,
    isEnabled: isGhostEnabled,
    onSuggestion: (text) => setSuggestions(prev => [text, ...prev].slice(0, 3))
  });

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 overflow-hidden font-sans selection:bg-indigo-500/30">

      {/* Sidebar */}
      <Sidebar
        rooms={MOCK_ROOMS}
        activeRoomId={activeRoomId}
        onSelectRoom={setActiveRoomId}
        isConnected={isConnected}
        suggestions={suggestions}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        {/* Top Bar */}
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-sm z-20 sticky top-0">

          {/* Breadcrumbs / Title */}
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Workspace</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-200 font-medium">
              {MOCK_ROOMS.find(r => r.id === activeRoomId)?.name || 'Untitled'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">

            {/* Ghost Toggle */}
            <button
              onClick={() => setIsGhostEnabled(!isGhostEnabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${isGhostEnabled
                ? 'bg-cyan-950 border-cyan-500 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                }`}
            >
              <Bot size={14} className={isGhostEnabled ? 'animate-pulse' : ''} />
              <span>{isGhostEnabled ? 'Ghost Active' : 'Enable Ghost'}</span>
            </button>

            {/* AI Assistant Trigger */}
            <button
              onClick={() => setIsCmdKOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-zinc-800 transition-all duration-300 group"
            >
              <Sparkles size={14} className="group-hover:text-indigo-400 transition-colors" />
              <span>Ask AI</span>
            </button>

            {/* Presence */}
            <div className="h-6 w-px bg-zinc-800 mx-2" />
            <Presence provider={provider} />

            <button className="p-2 hover:bg-zinc-800 rounded-md text-zinc-500 transition-colors">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* Editor Area */}
        {/* Key forces re-mount of editor when room changes to ensure clean Yjs binding */}
        {doc && provider ? (
          <Editor
            key={activeRoomId}
            doc={doc}
            provider={provider}
            user={currentUser}
            onContentUpdate={setContent}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              <p>Connecting to secure workspace...</p>
            </div>
          </div>
        )}

        {/* Cursor Chat Overlay for Other Users */}
        <CursorChatOverlay provider={provider} />

        {/* Cmd+K Hint */}
        <div className="absolute bottom-6 right-6 z-30 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-lg shadow-xl text-xs text-zinc-500">
            <CommandIcon size={12} />
            <span>Cmd+K for AI Actions</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CommandMenu
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
        documentContent={content}
      />

    </div>
  );
};

export default App;