import React, { useEffect, useState } from 'react';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from '../types';

interface CursorChatOverlayProps {
  provider: HocuspocusProvider | null;
}

export const CursorChatOverlay: React.FC<CursorChatOverlayProps> = ({ provider }) => {
  const [chats, setChats] = useState<{ id: string; user: User }[]>([]);

  useEffect(() => {
    if (!provider) return;

    const handleAwarenessChange = () => {
      const states = provider.awareness.getStates();
      const activeChats: { id: string; user: User }[] = [];

      states.forEach((state: any, clientId: number) => {
        // Filter out our own local client to avoid double rendering
        if (clientId !== provider.document.clientID && state.user && state.user.cursorChat?.isActive) {
          activeChats.push({
            id: clientId.toString(),
            user: state.user as User,
          });
        }
      });

      setChats(activeChats);
    };

    provider.awareness.on('change', handleAwarenessChange);
    return () => {
      provider.awareness.off('change', handleAwarenessChange);
    };
  }, [provider]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {chats.map(({ id, user }) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              x: user.cursorChat?.x || 0,
              y: user.cursorChat?.y || 0 
            }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 400
            }}
            className="absolute top-0 left-0 flex flex-col items-start"
          >
            <div 
              className="px-3 py-2 rounded-xl rounded-tl-none shadow-xl text-sm font-medium text-white max-w-xs break-words"
              style={{ backgroundColor: user.color }}
            >
              {user.cursorChat?.message}
            </div>
            {/* Optional: User Name Label */}
             <div className="mt-1 ml-1 px-1.5 py-0.5 bg-zinc-900/80 rounded text-[10px] text-zinc-400 backdrop-blur-sm">
                {user.name}
             </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};