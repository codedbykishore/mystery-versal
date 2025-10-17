/**
 * Utility functions for handling jigsaw puzzle piece images
 */

// Generate a data URL for a puzzle piece with text
export const generatePuzzlePiece = (
  pieceNumber: number,
  text: string,
  color: string = '#4F46E5',
  solved: boolean = false
): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  canvas.width = 200;
  canvas.height = 200;
  
  // Create puzzle piece shape (simplified)
  ctx.fillStyle = solved ? color : '#E5E7EB';
  ctx.fillRect(0, 0, 200, 200);
  
  // Add puzzle piece notches (simplified)
  if (pieceNumber !== 1 && pieceNumber !== 2 && pieceNumber !== 3) {
    // Top notch
    ctx.fillStyle = solved ? color : '#E5E7EB';
    ctx.beginPath();
    ctx.arc(100, 0, 20, 0, Math.PI);
    ctx.fill();
  }
  
  if (pieceNumber !== 1 && pieceNumber !== 4 && pieceNumber !== 7) {
    // Left notch
    ctx.fillStyle = solved ? color : '#E5E7EB';
    ctx.beginPath();
    ctx.arc(0, 100, 20, -Math.PI/2, Math.PI/2);
    ctx.fill();
  }
  
  // Add text
  ctx.fillStyle = solved ? 'white' : '#9CA3AF';
  ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split text into lines
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 160 && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);
  
  // Draw text lines
  const lineHeight = 20;
  const startY = 100 - ((lines.length - 1) * lineHeight) / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, 100, startY + index * lineHeight);
  });
  
  return canvas.toDataURL();
};

// Puzzle piece colors for each position
export const puzzlePieceColors = {
  1: '#EF4444', // Red
  2: '#F97316', // Orange  
  3: '#EAB308', // Yellow
  4: '#22C55E', // Green
  5: '#06B6D4', // Cyan
  6: '#3B82F6', // Blue
  7: '#8B5CF6', // Purple
  8: '#EC4899', // Pink
  9: '#F59E0B'  // Amber
};

// Final message parts for each piece
export const puzzlePieceTexts = {
  1: 'KNOWLEDGE',
  2: 'IS',
  3: 'POWER',
  4: 'SCATTERED',
  5: 'ACROSS',
  6: 'MANY',
  7: 'MINDS',
  8: 'UNITED',
  9: 'IN PURPOSE'
};

/**
 * Get the image URL for a puzzle piece
 */
export const getPuzzlePieceImage = (pieceNumber: number, solved: boolean = false): string => {
  const text = puzzlePieceTexts[pieceNumber as keyof typeof puzzlePieceTexts] || '';
  const color = puzzlePieceColors[pieceNumber as keyof typeof puzzlePieceColors] || '#6B7280';
  
  return generatePuzzlePiece(pieceNumber, text, color, solved);
};

/**
 * Preload all puzzle piece images
 */
export const preloadPuzzlePieces = (): Promise<void[]> => {
  const promises = [];
  
  for (let i = 1; i <= 9; i++) {
    // Preload both solved and unsolved versions
    const solvedPromise = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.src = getPuzzlePieceImage(i, true);
    });
    
    const unsolvedPromise = new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => resolve();
      img.src = getPuzzlePieceImage(i, false);
    });
    
    promises.push(solvedPromise, unsolvedPromise);
  }
  
  return Promise.all(promises);
};