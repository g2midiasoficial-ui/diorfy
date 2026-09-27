import React from 'react';
import { CanvasElement } from '../../types/miro';

interface ConnectorElementProps {
  element: CanvasElement;
  sourceEl?: CanvasElement;
  targetEl?: CanvasElement;
  isSelected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent?: (id: string, content: string) => void;
}

export const ConnectorElement: React.FC<ConnectorElementProps> = ({
  element,
  sourceEl,
  targetEl,
  isSelected,
  onSelect,
}) => {
  // Calculate source and target coordinates
  let startX = element.x;
  let startY = element.y;
  let endX = element.x + element.width;
  let endY = element.y + element.height;

  if (sourceEl) {
    const anchor = element.style.sourceAnchor || 'right';
    if (anchor === 'right') {
      startX = sourceEl.x + sourceEl.width;
      startY = sourceEl.y + sourceEl.height / 2;
    } else if (anchor === 'left') {
      startX = sourceEl.x;
      startY = sourceEl.y + sourceEl.height / 2;
    } else if (anchor === 'top') {
      startX = sourceEl.x + sourceEl.width / 2;
      startY = sourceEl.y;
    } else if (anchor === 'bottom') {
      startX = sourceEl.x + sourceEl.width / 2;
      startY = sourceEl.y + sourceEl.height;
    }
  }

  if (targetEl) {
    const anchor = element.style.targetAnchor || 'left';
    if (anchor === 'left') {
      endX = targetEl.x;
      endY = targetEl.y + targetEl.height / 2;
    } else if (anchor === 'right') {
      endX = targetEl.x + targetEl.width;
      endY = targetEl.y + targetEl.height / 2;
    } else if (anchor === 'top') {
      endX = targetEl.x + targetEl.width / 2;
      endY = targetEl.y;
    } else if (anchor === 'bottom') {
      endX = targetEl.x + targetEl.width / 2;
      endY = targetEl.y + targetEl.height;
    }
  }

  const strokeColor = element.style.color || '#64748b';
  const strokeWidth = element.style.strokeWidth || 2;
  const connectorType = element.style.connectorType || 'straight';

  // Construct path definition
  let pathD = `M ${startX} ${startY} L ${endX} ${endY}`;

  if (connectorType === 'orthogonal') {
    const midX = (startX + endX) / 2;
    pathD = `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
  } else if (connectorType === 'curved') {
    const dx = endX - startX;
    const dy = endY - startY;
    const cx1 = startX + dx * 0.5;
    const cy1 = startY;
    const cx2 = startX + dx * 0.5;
    const cy2 = endY;
    pathD = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
  }

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const markerId = `arrow-${element.id}`;

  return (
    <g onClick={onSelect} className="cursor-pointer group">
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill={strokeColor} />
        </marker>
      </defs>

      {/* Invisible wider stroke for easy clicking/selecting */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={strokeWidth + 14}
        className="cursor-pointer"
      />

      {/* Main connector path */}
      <path
        d={pathD}
        fill="none"
        stroke={isSelected ? '#2563eb' : strokeColor}
        strokeWidth={isSelected ? strokeWidth + 1 : strokeWidth}
        strokeDasharray={element.style.borderStyle === 'dashed' ? '4,4' : undefined}
        markerEnd={element.style.arrowEnd !== 'none' ? `url(#${markerId})` : undefined}
        className="transition-colors group-hover:stroke-blue-500"
      />

      {/* Optional Label in the middle */}
      {element.content && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x={-element.content.length * 4 - 8}
            y={-11}
            width={element.content.length * 8 + 16}
            height={22}
            rx={4}
            fill="#ffffff"
            stroke={strokeColor}
            strokeWidth={1}
          />
          <text
            x={0}
            y={4}
            textAnchor="middle"
            fill={strokeColor}
            fontSize="12"
            fontWeight="bold"
            className="select-none pointer-events-none"
          >
            {element.content}
          </text>
        </g>
      )}
    </g>
  );
};
