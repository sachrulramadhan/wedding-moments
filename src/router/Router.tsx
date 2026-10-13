import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function normalizePath(location: Location): string {
  // If hash routing is used (e.g., #/event/123), extract from hash
  if (location.hash && location.hash.startsWith('#/')) {
    const raw = location.hash.substring(1);
    const qIdx = raw.indexOf('?');
    return qIdx >= 0 ? raw.substring(0, qIdx) : raw;
  }
  // Otherwise use pathname
  return location.pathname || '/';
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => normalizePath(window.location));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location));
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    if (to === currentPath) return;
    // Push state and update path
    window.history.pushState({}, '', to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPath]);

  // Extract params based on pattern
  const params: Record<string, string> = {};
  const cleanPath = currentPath.split('?')[0];
  const segments = cleanPath.split('/').filter(Boolean);

  // Match /event/:eventId or /dashboard/events/:eventId
  if (segments[0] === 'event' && segments[1]) {
    params.eventId = segments[1];
  } else if (segments[0] === 'dashboard' && segments[1] === 'events' && segments[2] && segments[2] !== 'create') {
    params.eventId = segments[2];
  }

  return (
    <RouterContext.Provider value={{ path: currentPath, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
