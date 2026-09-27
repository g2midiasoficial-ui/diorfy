import React, { useState } from 'react';
import {
  Folder,
  User,
  Search,
  Lightbulb,
  TrendingUp,
  Star,
  MoreVertical,
  Plus,
  LayoutGrid,
  List,
  ChevronDown,
  Check,
  Lock,
  Edit2,
  Copy,
  Download,
  Trash2,
  Eye,
  FileText,
} from 'lucide-react';
import { BoardItem } from '../../types/miro';

interface BoardGridProps {
  boards: BoardItem[];
  onOpenBoard: (boardId: string) => void;
  onCreateNewBoard: () => void;
  onExploreTemplates: () => void;
  onToggleStar: (boardId: string) => void;
  onDuplicateBoard: (boardId: string) => void;
  onDeleteBoard: (boardId: string) => void;
  onRenameBoard: (boardId: string, newTitle: string) => void;
  onToggleReadOnly: (boardId: string) => void;
}

export const BoardGrid: React.FC<BoardGridProps> = ({
  boards,
  onOpenBoard,
  onCreateNewBoard,
  onExploreTemplates,
  onToggleStar,
  onDuplicateBoard,
  onDeleteBoard,
  onRenameBoard,
  onToggleReadOnly,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [boardFilter, setBoardFilter] = useState<'all' | 'owned' | 'readonly'>('all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'opened' | 'updated' | 'title'>('opened');

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Dropdown states
  const [showBoardFilterMenu, setShowBoardFilterMenu] = useState(false);
  const [showOwnerFilterMenu, setShowOwnerFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return <User className="w-5 h-5 text-purple-600" />;
      case 'search':
        return <Search className="w-5 h-5 text-orange-500" />;
      case 'lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'trending-up':
        return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      case 'folder':
      default:
        return <Folder className="w-5 h-5 text-amber-500" />;
    }
  };

  const handleStartRename = (b: BoardItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(b.id);
    setRenameValue(b.title);
    setActiveMenuId(null);
  };

  const handleSaveRename = (boardId: string) => {
    if (renameValue.trim()) {
      onRenameBoard(boardId, renameValue.trim());
    }
    setRenamingId(null);
  };

  // Filter & Sort logic
  const filteredBoards = boards
    .filter((b) => {
      if (boardFilter === 'readonly') return b.isReadOnly;
      if (boardFilter === 'owned') return !b.isReadOnly;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0; // maintain initial realistic order
    });

  return (
    <div className="select-none">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Boards neste time
        </h2>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExploreTemplates}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
          >
            Explorar templates
          </button>
          <button
            onClick={onCreateNewBoard}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#4262ff] hover:bg-[#3451e6] active:bg-[#2842d0] rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar novo</span>
          </button>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-200/80 mb-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter by boards */}
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Filtrar por</span>
            <div className="relative">
              <button
                onClick={() => setShowBoardFilterMenu(!showBoardFilterMenu)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 shadow-2xs"
              >
                <span>
                  {boardFilter === 'all'
                    ? 'Todos os boards'
                    : boardFilter === 'owned'
                    ? 'Meus boards'
                    : 'Somente leitura'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showBoardFilterMenu && (
                <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30">
                  <button
                    onClick={() => {
                      setBoardFilter('all');
                      setShowBoardFilterMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>Todos os boards</span>
                    {boardFilter === 'all' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setBoardFilter('owned');
                      setShowBoardFilterMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>Editáveis por mim</span>
                    {boardFilter === 'owned' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setBoardFilter('readonly');
                      setShowBoardFilterMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>Somente leitura</span>
                    {boardFilter === 'readonly' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Filter by owner */}
          <div className="relative">
            <button
              onClick={() => setShowOwnerFilterMenu(!showOwnerFilterMenu)}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 shadow-2xs"
            >
              <span>Qualquer titular</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Sort & View toggles */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span>Ordenar por</span>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800 shadow-2xs"
              >
                <span>
                  {sortBy === 'opened'
                    ? 'Última abertura'
                    : sortBy === 'updated'
                    ? 'Modificado recentemente'
                    : 'Nome (A-Z)'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30">
                  <button
                    onClick={() => {
                      setSortBy('opened');
                      setShowSortMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>Última abertura</span>
                    {sortBy === 'opened' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('title');
                      setShowSortMenu(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span>Nome (A-Z)</span>
                    {sortBy === 'title' && <Check className="w-3 h-3 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Grid vs List View Icons */}
          <div className="flex items-center bg-slate-100 rounded-md p-0.5 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${
                viewMode === 'grid'
                  ? 'bg-white shadow-2xs text-slate-900'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${
                viewMode === 'list'
                  ? 'bg-white shadow-2xs text-slate-900'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Board List Table View (Matching Screenshot 1) */}
      {viewMode === 'list' ? (
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-2.5 px-3 font-normal w-2/5">Nome</th>
                <th className="py-2.5 px-3 font-normal">Usuários online</th>
                <th className="py-2.5 px-3 font-normal">Última abertura</th>
                <th className="py-2.5 px-3 font-normal">Titular</th>
                <th className="py-2.5 px-3 font-normal w-16 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBoards.map((b) => {
                const isMenuOpen = activeMenuId === b.id;
                const isRenaming = renamingId === b.id;

                return (
                  <tr
                    key={b.id}
                    onClick={() => onOpenBoard(b.id)}
                    className="hover:bg-slate-50/80 group cursor-pointer transition-colors"
                  >
                    {/* Name column */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded flex items-center justify-center shrink-0">
                          {getIconComponent(b.icon)}
                        </div>
                        <div className="min-w-0">
                          {isRenaming ? (
                            <div
                              className="flex items-center gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="text"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveRename(b.id);
                                  if (e.key === 'Escape') setRenamingId(null);
                                }}
                                autoFocus
                                className="border border-blue-500 rounded px-1.5 py-0.5 text-xs font-semibold text-slate-900 outline-none"
                              />
                              <button
                                onClick={() => handleSaveRename(b.id)}
                                className="px-2 py-0.5 bg-blue-600 text-white rounded text-[11px]"
                              >
                                Salvar
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-xs truncate">
                                {b.title}
                              </span>
                              {b.isReadOnly && (
                                <span className="bg-slate-100 border border-slate-200/80 text-slate-600 text-[10px] font-medium px-1.5 py-0.2 rounded-xs">
                                  Somente leitura
                                </span>
                              )}
                            </div>
                          )}
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Modificado por {b.owner}, {b.updatedAt}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Online users */}
                    <td className="py-3 px-3 text-slate-400">
                      {b.id === 'board-planejamento-operacional' ? (
                        <div className="flex items-center -space-x-1.5">
                          <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                            G2
                          </span>
                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                            MS
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px]">—</span>
                      )}
                    </td>

                    {/* Opened date */}
                    <td className="py-3 px-3 text-slate-600 font-medium">
                      {b.openedAt}
                    </td>

                    {/* Owner */}
                    <td className="py-3 px-3 text-slate-600">
                      {b.owner}
                    </td>

                    {/* Actions: Star and Context Menu */}
                    <td
                      className="py-3 px-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1 relative">
                        <button
                          onClick={() => onToggleStar(b.id)}
                          className={`p-1.5 rounded hover:bg-slate-200/60 transition-colors ${
                            b.isStarred
                              ? 'text-amber-400'
                              : 'text-slate-300 group-hover:text-slate-400'
                          }`}
                          title={b.isStarred ? 'Remover dos favoritos' : 'Favoritar'}
                        >
                          <Star className={`w-4 h-4 ${b.isStarred ? 'fill-amber-400' : ''}`} />
                        </button>

                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(isMenuOpen ? null : b.id)}
                            className="p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-left">
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onOpenBoard(b.id);
                                }}
                                className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                Abrir board
                              </button>
                              <button
                                onClick={(e) => handleStartRename(b, e)}
                                className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                                Renomear
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onDuplicateBoard(b.id);
                                }}
                                className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-500" />
                                Duplicar
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onToggleReadOnly(b.id);
                                }}
                                className="w-full px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                              >
                                <Lock className="w-3.5 h-3.5 text-slate-500" />
                                {b.isReadOnly ? 'Tornar editável' : 'Tornar somente leitura'}
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onDeleteBoard(b.id);
                                }}
                                className="w-full px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid Thumbnail View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBoards.map((b) => (
            <div
              key={b.id}
              onClick={() => onOpenBoard(b.id)}
              className="group flex flex-col justify-between h-52 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:shadow-md transition-all cursor-pointer overflow-hidden p-3"
            >
              {/* Thumbnail representation */}
              <div className="h-32 w-full rounded-lg bg-slate-50 border border-slate-100 p-2 relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-6 h-6 rounded flex items-center justify-center">
                    {getIconComponent(b.icon)}
                  </div>
                  {b.isReadOnly && (
                    <span className="bg-slate-200 text-slate-700 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                      Somente leitura
                    </span>
                  )}
                </div>
                {/* Mini preview shapes */}
                <div className="flex gap-1.5 opacity-60">
                  <div className="w-8 h-8 rounded bg-amber-200" />
                  <div className="w-8 h-8 rounded bg-sky-200" />
                  <div className="w-8 h-8 rounded bg-emerald-200" />
                </div>
              </div>

              {/* Info */}
              <div className="mt-2 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate group-hover:text-blue-600">
                    {b.title}
                  </p>
                  <p className="text-[10px] text-slate-400">Aberto {b.openedAt}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(b.id);
                  }}
                  className="p-1 text-slate-300 hover:text-amber-400"
                >
                  <Star className={`w-3.5 h-3.5 ${b.isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
