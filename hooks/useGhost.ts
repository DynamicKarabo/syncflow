import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from 'y-protocols/awareness';

interface UseGhostProps {
  mainDoc: Y.Doc | null;
  provider: HocuspocusProvider | null;
  isEnabled: boolean;
  onSuggestion?: (suggestion: string) => void;
}

export const useGhost = ({ mainDoc, provider, isEnabled, onSuggestion }: UseGhostProps) => {
  const ghostDocRef = useRef<Y.Doc | null>(null);
  const ghostAwarenessRef = useRef<Awareness | null>(null);
  const intervalRef = useRef<any>(null);
  
  // Ghost Identity
  const ghostUser = {
    name: 'AI Ghost',
    color: '#06b6d4', // Cyan
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Ghost',
    cursorChat: { isActive: false, message: '', x: 0, y: 0 }
  };

  // Setup Ghost Environment
  useEffect(() => {
    if (!mainDoc || !provider) return;

    // 1. Create a separate Doc for the Ghost to "type" into
    const ghostDoc = new Y.Doc();
    ghostDocRef.current = ghostDoc;

    // 2. Create independent awareness for the Ghost
    const ghostAwareness = new Awareness(ghostDoc);
    ghostAwarenessRef.current = ghostAwareness;

    // 3. Sync Docs (Local Loopback)
    // When main doc updates, update ghost doc
    const handleMainUpdate = (update: Uint8Array) => {
      Y.applyUpdate(ghostDoc, update);
    };
    // When ghost doc updates, update main doc
    const handleGhostUpdate = (update: Uint8Array) => {
      Y.applyUpdate(mainDoc, update);
    };

    mainDoc.on('update', handleMainUpdate);
    ghostDoc.on('update', handleGhostUpdate);

    // 4. Sync Awareness (Local Loopback)
    // We need to inject the Ghost's awareness state into the Main Provider's awareness
    const handleGhostAwarenessUpdate = ({ added, updated, removed }: any, origin: any) => {
        // Encode the ghost's state
        const update = encodeAwarenessUpdate(ghostAwareness, [ghostAwareness.clientID]);
        // Apply it to the main provider
        applyAwarenessUpdate(provider.awareness, update, 'ghost');
    };

    ghostAwareness.on('update', handleGhostAwarenessUpdate);

    // Set initial identity
    ghostAwareness.setLocalState({
      user: {
        name: ghostUser.name,
        color: ghostUser.color,
        avatar: ghostUser.avatar,
        status: 'idle'
      }
    });

    return () => {
      mainDoc.off('update', handleMainUpdate);
      ghostDoc.off('update', handleGhostUpdate);
      ghostAwareness.off('update', handleGhostAwarenessUpdate);
      ghostDoc.destroy();
      ghostAwareness.destroy();
    };
  }, [mainDoc, provider]);

  // Ghost Behavior Loop
  useEffect(() => {
    if (!isEnabled || !ghostDocRef.current || !ghostAwarenessRef.current) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      // Clean up ghost presence when disabled
      if (ghostAwarenessRef.current) {
          // Effectively remove the user state or set to offline (simulated by destroying awareness usually, but here we just stop updating)
          // To properly remove from UI, we might need to destroy the awareness, but we re-create it on enable/disable effectively via the dependency array above if we moved creation there. 
          // For now, we just stop the actions.
      }
      return;
    }

    const doc = ghostDocRef.current;
    const awareness = ghostAwarenessRef.current;
    
    // Helper to type text
    const typeText = (text: string) => {
      const yText = doc.getText('default'); // 'default' is the standard StarterKit field? No, Tiptap uses 'default' usually if not configured otherwise, but StarterKit uses... wait. Tiptap defaults to XmlFragment 'default' or similar. 
      // Tiptap with Collaboration extension uses a Y.XmlFragment named 'default' usually, or just top-level types. 
      // Actually Tiptap Collaboration binds to `doc.getXmlFragment('default')`.
      // But simple text inserts are easier on a plain Y.Text if we knew the structure. 
      // Let's assume standard Tiptap structure: It's complex XML.
      // Modifying Tiptap document structure directly via Yjs is hard without the Schema.
      // Easier Strategy: Just move cursor and cursor-chat. Updating text might break the Tiptap schema if we are not careful (e.g. inserting text inside a block node).
      // Robust Ghost: Only move cursor and show chat. 
      // IF we must edit text: We can try to append to the end if we find a paragraph.
      
      // Let's stick to Cursor & Selection & Chat for safety, as requested: "Randomly highlight...", "AI Suggestion comment". 
      // "Simulate multi-user collaboration" -> usually implies seeing cursors.
    };

    const actions = [
      // Move Cursor
      () => {
        const yXmlFragment = doc.getXmlFragment('default');
        const docSize = yXmlFragment.toString().length; // Rough approximation
        const randomPos = Math.floor(Math.random() * (docSize + 100)); // +100 to allow some range
        
        // Update awareness selection
        awareness.setLocalStateField('selection', {
          anchor: randomPos,
          head: randomPos
        });
        
        // Update cursor chat position
        // We need X/Y coordinates for the chat bubble. 
        // Since we don't have the DOM rects of the ghost, we have to fake reasonable coords relative to window or rely on the fact that Tiptap calculates coords from selection anchor?
        // Actually, `CursorChatOverlay` uses `user.cursorChat.x/y`.
        // We can just fake some X/Y movement.
        const fakeX = 200 + Math.random() * 400;
        const fakeY = 200 + Math.random() * 400;
        
        awareness.setLocalStateField('user', {
            ...awareness.getLocalState().user,
            cursorChat: {
                isActive: false, // hide chat mostly
                x: fakeX,
                y: fakeY
            },
            status: 'active'
        });
      },
      // Highlight Text
      () => {
        const randomPos = Math.floor(Math.random() * 100);
        const randomLen = Math.floor(Math.random() * 20);
        
        awareness.setLocalStateField('selection', {
            anchor: randomPos,
            head: randomPos + randomLen
        });
        
        // Show "Thinking" in chat
        awareness.setLocalStateField('user', {
             ...awareness.getLocalState().user,
             cursorChat: {
                 isActive: true,
                 message: 'Thinking...',
                 x: 300 + Math.random() * 100, // Approximate
                 y: 300 + Math.random() * 100
             },
             status: 'typing'
        });
      },
      // Suggestion
      () => {
         if (onSuggestion) {
             const suggestions = [
                 "Consider breaking this paragraph up.",
                 "This tone seems a bit informal.",
                 "Maybe add a header here?",
                 "I can summarize this section if you like.",
                 "Check for passive voice."
             ];
             onSuggestion(suggestions[Math.floor(Math.random() * suggestions.length)]);
         }
         
         // Visual feedback in cursor chat
         awareness.setLocalStateField('user', {
            ...awareness.getLocalState().user,
            cursorChat: {
                isActive: true,
                message: 'I have a suggestion!',
                x: 400,
                y: 400
            }
         });
      }
    ];

    intervalRef.current = setInterval(() => {
      const action = actions[Math.floor(Math.random() * actions.length)];
      action();
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isEnabled, onSuggestion]);

  return null;
};
