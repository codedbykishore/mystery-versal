interface LockIconProps {
  x: number;
  y: number;
  size?: number;
  opacity?: number;
}

export function LockIcon({ x, y, size = 16, opacity = 0.9 }: LockIconProps) {
  const lockWidth = size;
  const lockHeight = size * 0.75;
  const lockTop = -size * 0.5;
  
  return (
    <g opacity={opacity}>
      {/* Lock body */}
      <rect
        x={x - lockWidth / 2}
        y={y + lockTop}
        width={lockWidth}
        height={lockHeight}
        rx="2"
        fill="rgba(255, 255, 255, 0.95)"
      />
      
      {/* Keyhole */}
      <circle
        cx={x}
        cy={y + lockTop + lockHeight * 0.35}
        r={size * 0.15}
        fill="rgba(51, 65, 85, 0.8)"
      />
      <rect
        x={x - size * 0.08}
        y={y + lockTop + lockHeight * 0.35}
        width={size * 0.16}
        height={size * 0.25}
        fill="rgba(51, 65, 85, 0.8)"
      />
      
      {/* Lock shackle */}
      <path
        d={`M ${x - lockWidth * 0.35} ${y + lockTop} 
            L ${x - lockWidth * 0.35} ${y + lockTop - size * 0.35}
            Q ${x - lockWidth * 0.35} ${y + lockTop - size * 0.55} ${x} ${y + lockTop - size * 0.55}
            Q ${x + lockWidth * 0.35} ${y + lockTop - size * 0.55} ${x + lockWidth * 0.35} ${y + lockTop - size * 0.35}
            L ${x + lockWidth * 0.35} ${y + lockTop}`}
        stroke="rgba(255, 255, 255, 0.95)"
        strokeWidth={size * 0.125}
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}