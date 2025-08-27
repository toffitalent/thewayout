import { useEffect, useState } from 'react';

const screens = {
  sm: '40em',
  md: '48em',
  lg: '64em',
  xl: '80em',
  '2xl': '80em',
};

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const listener = () => {
      const media = window.matchMedia?.(query);
      setMatches(media?.matches ?? false);
    };

    listener();

    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, [matches, query]);

  return matches;
};

export const useIsTablet = () => useMediaQuery(`(min-width: ${screens.md})`);
export const useIsDesktop = () => useMediaQuery(`(min-width: ${screens.lg})`);
