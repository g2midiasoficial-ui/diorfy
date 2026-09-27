export type ElementType =
  | 'sticky'
  | 'shape'
  | 'text'
  | 'connector'
  | 'draw'
  | 'frame'
  | 'image'
  | 'stamp'
  | 'mindmap';

export type ShapeType =
  | 'rectangle'
  | 'rounded'
  | 'circle'
  | 'diamond'
  | 'triangle'
  | 'star'
  | 'cylinder'
  | 'cloud'
  | 'speech'
  | 'hexagon'
  | 'octagon'
  | 'pentagon'
  | 'pill'
  | 'parallelogram'
  | 'trapezoid'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'document'
  | 'shield'
  | 'heart'
  | 'lightning'
  | 'cube'
  | 'tag'
  | 'gear'
  | 'badge'
  | 'step-chevron'
  | 'database'
  | 'cross'
  | 'bracket-left'
  | 'bracket-right';

export type ConnectorType = 'straight' | 'orthogonal' | 'curved';
export type ArrowHead = 'none' | 'arrow' | 'dot';

export interface Point {
  x: number;
  y: number;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface ElementStyle {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  fontSize?: number;
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontWeight?: 'normal' | 'medium' | 'bold';
  fontStyle?: 'normal' | 'italic';
  opacity?: number;
  shapeType?: ShapeType;
  connectorType?: ConnectorType;
  arrowStart?: ArrowHead;
  arrowEnd?: ArrowHead;
  sourceId?: string;
  targetId?: string;
  sourceAnchor?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  targetAnchor?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  points?: Point[];
  strokeWidth?: number;
  author?: string;
  tags?: string[];
  votes?: number;
  isLocked?: boolean;
  imageUrl?: string;
  aspectRatio?: number;
  // Mindmap specific
  isMindmapRoot?: boolean;
  mindmapColor?: string;
  parentId?: string;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  content: string;
  style: ElementStyle;
  reactions?: Reaction[];
  createdAt: number;
  frameId?: string;
}

export interface CanvasFrame {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor?: string;
  borderColor?: string;
  zIndex: number;
}

export interface CommentReply {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface CommentPin {
  id: string;
  x: number;
  y: number;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  resolved: boolean;
  replies: CommentReply[];
}

export interface BoardItem {
  id: string;
  title: string;
  icon: string;
  iconBg?: string;
  isReadOnly?: boolean;
  isStarred?: boolean;
  owner: string;
  updatedAt: string;
  openedAt: string;
  elements: CanvasElement[];
  frames: CanvasFrame[];
  comments?: CommentPin[];
  thumbnailColor?: string;
  description?: string;
  backgroundStyle?: 'grid' | 'dots' | 'blank';
  viewState?: {
    panX: number;
    panY: number;
    zoom: number;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
}

export interface BoardTemplate {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  tag?: string;
  icon: string;
  description: string;
  badgeLanguage?: string;
  elements: CanvasElement[];
  frames: CanvasFrame[];
  previewGradient?: string;
}

export interface CollaboratorCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  activeTool?: string;
}

export interface VotingSession {
  isActive: boolean;
  title: string;
  votesPerUser: number;
  remainingVotes: number;
  userVotes: Record<string, number>;
  results?: { elementId: string; title: string; count: number }[];
}
