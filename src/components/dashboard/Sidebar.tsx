import React, { useState } from 'react';
import {
  Home,
  Clock,
  Star,
  Video,
  Search,
  ChevronDown,
  Plus,
  Trash2,
  FolderOpen,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

export type DashboardView = 'all' | 'recent' | 'favorites' | 'recordings' | 'trash';

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  teamName: string;
  onSelectTeam?: (team: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  teamName,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [showTeamMenu, setShowTeamMenu] = useState(false);
  const [teams, setTeams] = useState(['drop', 'Marketing Team', 'Engenharia', 'Diorfy Studio']);
  const [selectedTeam, setSelectedTeam] = useState(teamName);

  const navItems: { id: DashboardView; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Início', icon: <Home className="w-4 h-4" /> },
    { id: 'recent', label: 'Recente', icon: <Clock className="w-4 h-4" /> },
    { id: 'favorites', label: 'Favorito', icon: <Star className="w-4 h-4" /> },
    { id: 'recordings', label: 'Suas gravações (TalkTrack)', icon: <Video className="w-4 h-4" /> },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      <div className="p-3">
        {/* Workspace Dropdown */}
        <div className="relative mb-3 flex items-center justify-between">
          <button
            onClick={() => setShowTeamMenu(!showTeamMenu)}
            className="flex-1 flex items-center justify-between p-2 rounded-lg hover:bg-slate-200/70 transition-colors text-left group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-md bg-[#1e1b4b] text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-2xs">
                {selectedTeam.substring(0, 2)}
              </div>
              <span className="font-bold text-sm text-slate-900 truncate">
                {selectedTeam}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-800 shrink-0" />
          </button>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {showTeamMenu && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Times do Workspace Diorfy
              </div>
              {teams.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setSelectedTeam(t);
                    setShowTeamMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-800 hover:bg-slate-100 flex items-center justify-between"
                >
                  <span className="truncate">{t}</span>
                  {selectedTeam === t && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquise por título ou tema"
            className="w-full bg-slate-200/60 hover:bg-slate-200 focus:bg-white text-xs text-slate-900 rounded-lg pl-9 pr-3 py-2 outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-200/90 text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                <span className={isActive ? 'text-blue-600' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Storage status */}
      <div className="p-3 border-t border-slate-200/70 text-xs text-slate-500">
        <div className="flex items-center justify-between mb-1 text-[11px]">
          <span className="flex items-center gap-1 font-medium text-slate-600">
            <Sparkles className="w-3 h-3 text-amber-500" /> Diorfy Cloud
          </span>
          <span className="font-semibold text-emerald-600">Sincronizado</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-full rounded-full" />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
          Workspace colaborativo ativo.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-60 bg-[#f8f9fa] border-r border-slate-200 flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-2xs animate-in fade-in"
          />
          <aside className="relative w-64 max-w-[80vw] bg-[#f8f9fa] h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
