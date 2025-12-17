import React from 'react';
import { LayoutGrid, Hash, Plus, Settings, Search, ChevronDown, Wifi, Sparkles } from 'lucide-react';
import { Room } from '../types';

interface SidebarProps {
  rooms: Room[];
  activeRoomId: string;
  onSelectRoom: (id: string) => void;
  isConnected: boolean;
  suggestions?: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ rooms, activeRoomId, onSelectRoom, isConnected, suggestions = [] }) => {
  return (
    <div className="w-64 h-full border-r border-zinc-800 bg-zinc-950 flex flex-col text-sm">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-zinc-100">
          <img src="https://i.imgur.com/uG7b4v3.png" alt="SyncFlow" className="h-8 object-contain select-none" />
        </div>
        <ChevronDown size={14} className="text-zinc-500" />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        
        {/* Connection Status */}
        <div className="px-2">
            <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1.5 rounded border ${isConnected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                <Wifi size={12} />
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
        </div>

        {/* Section 1 */}
        <div>
          <div className="px-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center justify-between group">
            <span>Favorites</span>
          </div>
          <div className="space-y-0.5">
             <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 rounded-md cursor-pointer transition-colors">
               <Search size={14} />
               <span>Search</span>
             </div>
             <div className="flex items-center gap-2 px-2 py-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100 rounded-md cursor-pointer transition-colors">
               <Settings size={14} />
               <span>Settings</span>
             </div>
          </div>
        </div>

        {/* Rooms List */}
        <div>
          <div className="px-2 mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center justify-between group">
            <span>Rooms</span>
            <Plus size={14} className="opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-200 transition-opacity" />
          </div>
          <div className="space-y-0.5">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all duration-200 ${
                  activeRoomId === room.id
                    ? 'bg-zinc-800/50 text-indigo-400'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Hash size={14} className={activeRoomId === room.id ? 'text-indigo-400' : 'text-zinc-600'} />
                <span className="truncate">{room.name}</span>
                {room.isActive && (
                  <span className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI Suggestions (Ghost Output) */}
        {suggestions.length > 0 && (
            <div className="animate-in slide-in-from-left duration-500">
                <div className="px-2 mb-2 text-xs font-medium text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={12} />
                    <span>AI Suggestions</span>
                </div>
                <div className="space-y-2 px-2">
                    {suggestions.map((s, i) => (
                        <div key={i} className="p-2 bg-zinc-900 border border-indigo-500/20 rounded-md text-xs text-zinc-300 shadow-sm">
                            {s}
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-3 hover:bg-zinc-900 p-2 rounded-md cursor-pointer transition-colors">
          <img 
            src="https://picsum.photos/32/32" 
            alt="User" 
            className="w-8 h-8 rounded-full bg-zinc-800 object-cover" 
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-zinc-200 truncate">Me</div>
            <div className="text-xs text-zinc-500 truncate">Online</div>
          </div>
        </div>
      </div>
    </div>
  );
};