import React, { useState } from 'react';
import { X, Mail, Link as LinkIcon, Check, Copy, Shield, Users } from 'lucide-react';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose, teamName }) => {
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState<'editor' | 'commenter' | 'viewer'>('editor');
  const [copied, setCopied] = useState(false);
  const [invitedList, setInvitedList] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emails.trim()) return;
    const list = emails.split(',').map((s) => s.trim()).filter(Boolean);
    setInvitedList((prev) => [...prev, ...list]);
    setEmails('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://diorfy.app/team/${teamName}/join`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Convidar para o time {teamName}</h3>
              <p className="text-xs text-slate-500">Membros terão acesso aos quadros do time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          <form onSubmit={handleSendInvite} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              E-mails dos convidados (separados por vírgula)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="nome@empresa.com, colega@gmail.com"
                className="flex-1 text-xs border border-slate-300 focus:border-blue-500 rounded-lg px-3 py-2 outline-none"
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="text-xs border border-slate-300 rounded-lg px-2 py-2 bg-white text-slate-700 outline-none"
              >
                <option value="editor">Pode editar</option>
                <option value="commenter">Pode comentar</option>
                <option value="viewer">Pode ver</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              Enviar convite
            </button>
          </form>

          {successMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Convites enviados com sucesso!</span>
            </div>
          )}

          {/* Copy link section */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-medium text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                Link de convite do time
              </span>
              <span className="text-[11px] text-slate-400">Qualquer pessoa com link</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://miro.com/app/board/join-team-${teamName}`}
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-500 text-xs rounded-lg px-3 py-2 select-all outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
