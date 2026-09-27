import React, { useState } from 'react';
import { X, Link as LinkIcon, Check, Copy, Users, Globe, Lock } from 'lucide-react';
import { BoardItem } from '../../types/miro';

interface ShareModalProps {
  board: BoardItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ board, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState<'public' | 'team' | 'private'>('team');
  const [guestEmail, setGuestEmail] = useState('');
  const [collaboratorList, setCollaboratorList] = useState([
    { name: 'G2 midias (Você)', email: 'g2midiasoficial@gmail.com', role: 'Proprietário' },
    { name: 'Mariana Silva', email: 'mariana.silva@empresa.com', role: 'Editor' },
  ]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://diorfy.app/board/${board.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail.trim()) return;
    setCollaboratorList((prev) => [
      ...prev,
      { name: guestEmail.split('@')[0], email: guestEmail.trim(), role: 'Editor' },
    ]);
    setGuestEmail('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in select-none">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Compartilhar quadro</h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{board.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Invite via Email */}
          <form onSubmit={handleAddCollaborator} className="flex gap-2">
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="Adicionar pessoas por e-mail..."
              className="flex-1 text-xs border border-slate-300 focus:border-blue-500 rounded-lg px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              Convidar
            </button>
          </form>

          {/* Permissions / Link sharing */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Globe className="w-4 h-4 text-slate-500" />
                <span>Qualquer pessoa no time "drop"</span>
              </div>
              <select
                value={accessLevel}
                onChange={(e) => setAccessLevel(e.target.value as any)}
                className="text-xs border border-slate-300 rounded-md px-2 py-1 bg-white text-slate-800 outline-none"
              >
                <option value="team">Pode editar</option>
                <option value="public">Pode ver</option>
                <option value="private">Bloqueado</option>
              </select>
            </div>
          </div>

          {/* Collaborators List */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Pessoas com acesso</p>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {collaboratorList.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.email}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">{c.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Link Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link copiado!' : 'Copiar link do quadro'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
