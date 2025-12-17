import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { User } from '../types';

interface EditorProps {
  provider: HocuspocusProvider | null;
  doc: Y.Doc | null;
  user: User;
  onContentUpdate: (text: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ provider, doc, user, onContentUpdate }) => {
  const [status, setStatus] = useState('connecting');

  // Cursor Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatCoords, setChatCoords] = useState({ x: 0, y: 0 });
  const chatInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: doc || undefined,
      }),
      ...(provider ? [
        CollaborationCursor.configure({
          provider: provider,
          user: {
            name: user.name,
            color: user.color,
          },
        })
      ] : []),
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-zinc max-w-none focus:outline-none min-h-[500px] text-zinc-300',
      },
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      onContentUpdate(text);
    }
  }, [doc, provider]);

  // Sync loading state
  useEffect(() => {
    if (!provider) return;

    const onStatus = () => {
      setStatus(provider.status);
    }

    provider.on('status', onStatus);
    return () => {
      provider.off('status', onStatus);
    }
  }, [provider]);

  // Handle Cursor Chat Trigger (/)
  useEffect(() => {
    if (!editor || !provider) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if chat is closed and '/' is pressed
      if (e.key === '/' && !isChatOpen) {
        // Prevent the '/' from being typed into the editor
        e.preventDefault();

        const { from } = editor.state.selection;
        // Get screen coordinates for the cursor position
        const coords = editor.view.coordsAtPos(from);

        // Adjust coordinates to sit slightly above the line
        // Note: coordsAtPos returns { top, bottom, left, right }
        const x = coords.left;
        const y = coords.top - 40; // Shift up to show bubble

        setChatCoords({ x, y });
        setChatMessage('');
        setIsChatOpen(true);

        // Update awareness to notify others we started chatting
        updateAwareness(true, '', x, y);

        // Focus the chat input on next tick
        setTimeout(() => chatInputRef.current?.focus(), 10);
      }
    };

    const viewDom = editor.view.dom;
    viewDom.addEventListener('keydown', handleKeyDown);

    return () => {
      viewDom.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, isChatOpen, provider]);

  // Helper to sync state to Yjs Awareness
  const updateAwareness = (isActive: boolean, message: string, x: number, y: number) => {
    if (!provider) return;
    const currentState = provider.awareness.getLocalState();
    provider.awareness.setLocalState({
      ...currentState,
      user: {
        ...currentState.user,
        cursorChat: { isActive, message, x, y }
      }
    });
  };

  const closeChat = () => {
    setIsChatOpen(false);
    setChatMessage('');
    updateAwareness(false, '', 0, 0);
    editor?.commands.focus();
  };

  const handleChatKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      closeChat();
    }
  };

  const handleChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const msg = e.target.value;
    setChatMessage(msg);
    updateAwareness(true, msg, chatCoords.x, chatCoords.y);
  };

  if (!editor || !doc || !provider) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Loading Editor...
      </div>
    );
  }

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col bg-zinc-950">
      <div className="relative flex-1 max-w-4xl mx-auto w-full p-12 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Local Cursor Chat Input */}
      {isChatOpen && (
        <div
          className="fixed z-50 flex flex-col items-start"
          style={{
            left: chatCoords.x,
            top: chatCoords.y
          }}
        >
          <div
            className="px-3 py-2 rounded-xl rounded-tl-none shadow-xl text-sm font-medium text-white min-w-[120px]"
            style={{ backgroundColor: user.color }}
          >
            <input
              ref={chatInputRef}
              type="text"
              value={chatMessage}
              onChange={handleChatChange}
              onKeyDown={handleChatKeyDown}
              onBlur={closeChat}
              className="w-full bg-transparent border-none outline-none text-white placeholder-white/70"
              placeholder="Say something..."
            />
          </div>
        </div>
      )}
    </div>
  );
};