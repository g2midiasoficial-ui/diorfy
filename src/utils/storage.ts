import { BoardItem, CanvasElement, CanvasFrame } from '../types/miro';
import { INITIAL_BOARDS } from '../data/initialBoards';

const BOARDS_KEY = 'miro_workspace_boards_v1';
const RECENT_KEY = 'miro_workspace_recent_v1';
const SETTINGS_KEY = 'miro_workspace_settings_v1';

export function loadBoards(): BoardItem[] {
  try {
    const raw = localStorage.getItem(BOARDS_KEY);
    if (!raw) {
      saveBoards(INITIAL_BOARDS);
      return INITIAL_BOARDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_BOARDS;
  } catch (err) {
    console.warn('Failed to load boards from localStorage', err);
    return INITIAL_BOARDS;
  }
}

export function saveBoards(boards: BoardItem[]): void {
  try {
    localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
  } catch (err) {
    console.error('Failed to save boards', err);
  }
}

export function getBoardById(id: string): BoardItem | undefined {
  const boards = loadBoards();
  return boards.find((b) => b.id === id);
}

export function updateBoard(
  boardId: string,
  updater: (prev: BoardItem) => BoardItem
): BoardItem | null {
  const boards = loadBoards();
  const index = boards.findIndex((b) => b.id === boardId);
  if (index === -1) return null;

  const updated = updater(boards[index]);
  boards[index] = {
    ...updated,
    updatedAt: 'Agora',
    openedAt: 'Agora',
  };
  saveBoards(boards);
  return boards[index];
}

export function createNewBoard(
  title: string = 'Sem título',
  templateElements: CanvasElement[] = [],
  templateFrames: CanvasFrame[] = [],
  description: string = 'Quadro de colaboração visual'
): BoardItem {
  const boards = loadBoards();
  const newBoard: BoardItem = {
    id: `board-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    icon: 'folder',
    iconBg: 'bg-blue-100 text-blue-600',
    isReadOnly: false,
    isStarred: false,
    owner: 'G2 midias',
    updatedAt: 'Hoje',
    openedAt: 'Hoje',
    description,
    elements: templateElements.map((el) => ({
      ...el,
      id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: Date.now(),
    })),
    frames: templateFrames.map((f) => ({
      ...f,
      id: `frame-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    })),
    comments: [],
  };

  const updatedBoards = [newBoard, ...boards];
  saveBoards(updatedBoards);
  return newBoard;
}

export function duplicateBoard(boardId: string): BoardItem | null {
  const boards = loadBoards();
  const original = boards.find((b) => b.id === boardId);
  if (!original) return null;

  const duplicated: BoardItem = {
    ...original,
    id: `board-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `${original.title} (Cópia)`,
    updatedAt: 'Agora',
    openedAt: 'Agora',
    isStarred: false,
    elements: JSON.parse(JSON.stringify(original.elements)),
    frames: JSON.parse(JSON.stringify(original.frames)),
    comments: [],
  };

  const updatedBoards = [duplicated, ...boards];
  saveBoards(updatedBoards);
  return duplicated;
}

export function deleteBoard(boardId: string): void {
  const boards = loadBoards();
  const filtered = boards.filter((b) => b.id !== boardId);
  saveBoards(filtered);
}

export function toggleStarBoard(boardId: string): boolean {
  const boards = loadBoards();
  const board = boards.find((b) => b.id === boardId);
  if (!board) return false;
  board.isStarred = !board.isStarred;
  saveBoards(boards);
  return !!board.isStarred;
}
