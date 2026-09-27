import React, { useState } from 'react';
import { CommentPin } from '../../types/miro';
import { MessageSquare, Check, Send, X, User } from 'lucide-react';

interface CommentPinElementProps {
  comment: CommentPin;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onAddReply: (commentId: string, replyText: string) => void;
  onResolve: (commentId: string) => void;
}

export const CommentPinElement: React.FC<CommentPinElementProps> = ({
  comment,
  isSelected,
  onSelect,
  onAddReply,
  onResolve,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onAddReply(comment.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div
      className="absolute select-none z-40"
      style={{ left: `${comment.x}px`, top: `${comment.y}px` }}
    >
      {/* Pin Icon Bubble */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
          onSelect(e);
        }}
        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 ${
          comment.resolved
            ? 'bg-slate-400 text-white'
            : 'bg-[#4262ff] text-white hover:bg-blue-700'
        }`}
        title={`Comentário de ${comment.author}`}
      >
        <MessageSquare className="w-3.5 h-3.5 fill-current" />
      </button>

      {/* Popover Thread */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-9 top-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-3 z-50 text-xs animate-in fade-in"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center">
                {comment.avatar || 'G2'}
              </div>
              <div>
                <p className="font-bold text-slate-900">{comment.author}</p>
                <p className="text-[10px] text-slate-400">{comment.timestamp}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onResolve(comment.id)}
                className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                title="Resolver comentário"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Original Text */}
          <div className="py-2.5 text-slate-800 leading-relaxed font-medium">
            {comment.text}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 max-h-36 overflow-y-auto">
              {comment.replies.map((r) => (
                <div key={r.id} className="bg-slate-50 p-2 rounded-lg">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="font-bold text-slate-700">{r.author}</span>
                    <span>{r.timestamp}</span>
                  </div>
                  <p className="text-slate-800">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          <form onSubmit={handleSend} className="mt-2.5 pt-2 border-t border-slate-100 flex gap-1.5">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva uma resposta..."
              className="flex-1 bg-slate-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-lg px-2.5 py-1.5 text-xs outline-none"
            />
            <button
              type="submit"
              className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
