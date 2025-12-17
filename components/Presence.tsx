import React, { useEffect, useState } from 'react';
import { User } from '../types';
import { HocuspocusProvider } from '@hocuspocus/provider';

interface PresenceProps {
  provider: HocuspocusProvider | null;
}

export const Presence: React.FC<PresenceProps> = ({ provider }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!provider) return;

    const updateUsers = () => {
      const states = provider.awareness.getStates();
      const activeUsers: User[] = [];
      
      states.forEach((state: any, clientId: number) => {
        if (state.user) {
          activeUsers.push({
            id: clientId.toString(),
            name: state.user.name,
            color: state.user.color,
            avatar: state.user.avatar,
            status: 'active' // We could derive typing status if we stored it in awareness
          });
        }
      });

      setUsers(activeUsers);
    };

    provider.awareness.on('change', updateUsers);
    updateUsers(); // Initial fetch

    return () => {
      provider.awareness.off('change', updateUsers);
    };
  }, [provider]);

  return (
    <div className="flex items-center -space-x-2">
      {users.map((user) => (
        <div key={user.id} className="relative group cursor-pointer transition-transform hover:z-10 hover:scale-110">
          <div 
            className={`w-8 h-8 rounded-full border-2 border-zinc-950 flex items-center justify-center text-xs font-bold uppercase text-zinc-950`}
            style={{ backgroundColor: user.color }}
            title={user.name}
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name.slice(0, 2)
            )}
          </div>
          {/* Status Indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-950 rounded-full"></span>
          
          {/* Name Tooltip */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-xs px-2 py-1 rounded text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
            {user.name}
          </div>
        </div>
      ))}
      
      {users.length === 0 && (
          <div className="text-xs text-zinc-500 px-2">No other users</div>
      )}
    </div>
  );
};