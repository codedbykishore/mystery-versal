import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PlatformContextType {
  platform: 'android' | 'ios' | 'web';
  fullscreen: boolean;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export const usePlatform = () => {
  const context = useContext(PlatformContext);
  if (context === undefined) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
};

interface PlatformProviderProps {
  children: ReactNode;
}

export const PlatformProvider: React.FC<PlatformProviderProps> = ({ children }) => {
  const [platform, setPlatform] = useState<'android' | 'ios' | 'web'>('web');
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    // Detect platform from user agent
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) {
      setPlatform('android');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setPlatform('ios');
    } else {
      setPlatform('web');
    }

    // Detect fullscreen mode
    const checkFullscreen = () => {
      const isFullscreen = 
        document.fullscreenElement !== null ||
        (document as any).webkitFullscreenElement !== null ||
        (document as any).mozFullScreenElement !== null ||
        (document as any).msFullscreenElement !== null;
      
      setFullscreen(isFullscreen);
    };

    checkFullscreen();

    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('msfullscreenchange', checkFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('mozfullscreenchange', checkFullscreen);
      document.removeEventListener('msfullscreenchange', checkFullscreen);
    };
  }, []);

  return (
    <PlatformContext.Provider value={{ platform, fullscreen }}>
      {children}
    </PlatformContext.Provider>
  );
};
