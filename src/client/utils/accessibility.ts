/**
 * Accessibility utilities for the Mystery Versal game
 */

/**
 * Announce text to screen readers
 */
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Focus management for modal dialogs and page transitions
 */
export const manageFocus = {
  // Store the previously focused element
  previousElement: null as HTMLElement | null,
  
  // Set focus to an element and store the previous one
  set: (element: HTMLElement | null) => {
    if (manageFocus.previousElement) {
      manageFocus.previousElement = document.activeElement as HTMLElement;
    }
    if (element) {
      element.focus();
    }
  },
  
  // Restore focus to the previously focused element
  restore: () => {
    if (manageFocus.previousElement) {
      manageFocus.previousElement.focus();
      manageFocus.previousElement = null;
    }
  },
  
  // Trap focus within a container (for modals)
  trap: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
};

/**
 * Keyboard navigation helpers
 */
export const keyboardNavigation = {
  // Handle arrow key navigation in grids
  handleGridNavigation: (
    e: KeyboardEvent, 
    currentIndex: number, 
    totalItems: number, 
    columns: number,
    onNavigate: (newIndex: number) => void
  ) => {
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newIndex = currentIndex - columns;
        if (newIndex >= 0) onNavigate(newIndex);
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        newIndex = currentIndex + columns;
        if (newIndex < totalItems) onNavigate(newIndex);
        break;
        
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex - 1;
        if (newIndex >= 0) onNavigate(newIndex);
        break;
        
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex + 1;
        if (newIndex < totalItems) onNavigate(newIndex);
        break;
        
      case 'Home':
        e.preventDefault();
        onNavigate(0);
        break;
        
      case 'End':
        e.preventDefault();
        onNavigate(totalItems - 1);
        break;
    }
  }
};

/**
 * Generate descriptive text for puzzle states
 */
export const getPuzzleStateDescription = (
  puzzleId: number,
  state: 'locked' | 'unlocked' | 'solved',
  subreddit?: string
): string => {
  const baseText = `Puzzle ${puzzleId}${subreddit ? ` from ${subreddit}` : ''}`;
  
  switch (state) {
    case 'locked':
      return `${baseText} is locked. Complete previous puzzles to unlock.`;
    case 'unlocked':
      return `${baseText} is available to solve. Press Enter or Space to open.`;
    case 'solved':
      return `${baseText} has been completed by the community.`;
    default:
      return baseText;
  }
};

/**
 * Generate progress announcements
 */
export const getProgressAnnouncement = (solved: number, total: number): string => {
  const percentage = Math.round((solved / total) * 100);
  
  if (solved === 0) {
    return "Welcome to Mystery Versal! No puzzles solved yet. Start with the unlocked puzzles.";
  }
  
  if (solved === total) {
    return "Congratulations! All puzzles have been solved. The mystery is complete!";
  }
  
  return `Progress update: ${solved} of ${total} puzzles solved. ${percentage}% complete.`;
};

/**
 * Color contrast utilities
 */
export const colorContrast = {
  // Check if color combination meets WCAG AA standards
  meetsWCAG: (foreground: string, background: string): boolean => {
    // This is a simplified check - in production, use a proper contrast ratio calculator
    const fgLuminance = colorContrast.getLuminance(foreground);
    const bgLuminance = colorContrast.getLuminance(background);
    
    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                  (Math.min(fgLuminance, bgLuminance) + 0.05);
    
    return ratio >= 4.5; // WCAG AA standard
  },
  
  // Calculate relative luminance (simplified)
  getLuminance: (color: string): number => {
    // This is a very simplified calculation
    // In production, use a proper color library
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
};