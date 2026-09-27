export interface ShortcutAction {
  id: string;
  label: string;
  category: 'tools' | 'zoom' | 'edit' | 'ai_features' | 'view';
  description: string;
  defaultKey: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}

export type CustomShortcutMap = Record<string, {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
}>;

export const DEFAULT_SHORTCUTS: ShortcutAction[] = [
  // 1. Tools
  { id: 'tool_select', label: 'Ferramenta Seleção / Ponteiro', category: 'tools', description: 'Ativa o modo de seleção de elementos (V)', defaultKey: 'v' },
  { id: 'tool_pan', label: 'Ferramenta Mão / Panorâmica (Mãozinha)', category: 'tools', description: 'Move e navega livremente pelo quadro em todas as direções (H / Espaço)', defaultKey: 'h' },
  { id: 'tool_sticky', label: 'Criar Nota Adesiva (Post-it)', category: 'tools', description: 'Insere uma nota adesiva amarela', defaultKey: 'n' },
  { id: 'tool_shape', label: 'Criar Forma Geométrica', category: 'tools', description: 'Insere um retângulo ou forma', defaultKey: 's' },
  { id: 'tool_text', label: 'Criar Caixa de Texto', category: 'tools', description: 'Insere bloco de texto editável', defaultKey: 't' },
  { id: 'tool_connector', label: 'Linha de Conexão / Seta', category: 'tools', description: 'Conecta dois elementos com seta', defaultKey: 'l' },
  { id: 'tool_pen', label: 'Caneta de Desenho Livre', category: 'tools', description: 'Desenho manual e marca-texto', defaultKey: 'p' },
  { id: 'tool_frame', label: 'Criar Frame de Apresentação', category: 'tools', description: 'Quadro organizador de slides', defaultKey: 'f' },
  { id: 'tool_comment', label: 'Adicionar Comentário Pin', category: 'tools', description: 'Fixa um ponto de discussão', defaultKey: 'c' },

  // 2. Zoom & Navigation
  { id: 'zoom_in', label: 'Aumentar Zoom (+)', category: 'zoom', description: 'Aproxima a visão do canvas', defaultKey: '+' },
  { id: 'zoom_out', label: 'Diminuir Zoom (-)', category: 'zoom', description: 'Afasta a visão do canvas', defaultKey: '-' },
  { id: 'zoom_reset', label: 'Resetar Zoom (100%)', category: 'zoom', description: 'Restaura a escala para 100%', defaultKey: '0' },
  { id: 'zoom_fit', label: 'Ajustar Todo Conteúdo (Fit)', category: 'zoom', description: 'Enquadra todos os elementos na tela', defaultKey: '1' },
  { id: 'zoom_selection', label: 'Zoom na Seleção', category: 'zoom', description: 'Foca no elemento selecionado', defaultKey: '2' },

  // 3. Edit & Manipulate
  { id: 'edit_undo', label: 'Desfazer Ação', category: 'edit', description: 'Desfaz a última alteração', defaultKey: 'z', ctrlKey: true },
  { id: 'edit_redo', label: 'Refazer Ação', category: 'edit', description: 'Refaz a alteração desfeita', defaultKey: 'y', ctrlKey: true },
  { id: 'edit_copy', label: 'Copiar Seleção / Imagem', category: 'edit', description: 'Copia elementos ou imagens selecionadas', defaultKey: 'c', ctrlKey: true },
  { id: 'edit_cut', label: 'Recortar Seleção', category: 'edit', description: 'Recorta os elementos selecionados', defaultKey: 'x', ctrlKey: true },
  { id: 'edit_paste', label: 'Colar Elementos / Imagem', category: 'edit', description: 'Cola imagens do clipboard ou elementos copiados', defaultKey: 'v', ctrlKey: true },
  { id: 'edit_duplicate', label: 'Duplicar Seleção', category: 'edit', description: 'Duplica os elementos selecionados', defaultKey: 'd', ctrlKey: true },
  { id: 'edit_delete', label: 'Excluir Seleção', category: 'edit', description: 'Apaga os elementos selecionados', defaultKey: 'Delete' },
  { id: 'edit_lock', label: 'Bloquear / Desbloquear', category: 'edit', description: 'Trava elemento para não ser movido', defaultKey: 'l', ctrlKey: true },

  // 4. AI & Studios
  { id: 'action_command_palette', label: 'Command Palette (Spotlight)', category: 'ai_features', description: 'Busca rápida de ferramentas e ações', defaultKey: 'k', ctrlKey: true },
  { id: 'action_ai_copilot', label: 'Abrir Agente Diorfy AI', category: 'ai_features', description: 'Abre o copilot de ideação', defaultKey: 'j' },
  { id: 'action_nano_banana', label: 'Abrir Nano Banana Imagens', category: 'ai_features', description: 'Gerador de imagens com IA', defaultKey: 'b' },
  { id: 'action_motion_slides', label: 'Abrir Estúdio Motion Slides', category: 'ai_features', description: 'Montagem de apresentações animadas', defaultKey: 'o' },
  { id: 'action_mindmap_studio', label: 'Abrir Estúdio de Mapas Mentais', category: 'ai_features', description: 'Gerador e editor de mapas mentais', defaultKey: 'm' },

  // 5. View & Grid
  { id: 'view_toggle_grid', label: 'Alternar Grid Magnético', category: 'view', description: 'Ativa / desativa alinhamento magnético', defaultKey: 'g' },
  { id: 'view_toggle_minimap', label: 'Alternar Minimapa', category: 'view', description: 'Mostra ou oculta o radar do minimapa', defaultKey: 'm', ctrlKey: true },
];

export function getShortcutDisplay(shortcut: { key: string; ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean; metaKey?: boolean }): string {
  const parts: string[] = [];
  if (shortcut.ctrlKey || shortcut.metaKey) parts.push('Ctrl');
  if (shortcut.altKey) parts.push('Alt');
  if (shortcut.shiftKey) parts.push('Shift');
  
  let keyName = shortcut.key.toUpperCase();
  if (shortcut.key === ' ') keyName = 'Espaço';
  if (shortcut.key === 'Delete') keyName = 'Del';
  if (shortcut.key === 'Backspace') keyName = 'Backspace';
  if (shortcut.key === 'Escape') keyName = 'Esc';

  parts.push(keyName);
  return parts.join(' + ');
}
