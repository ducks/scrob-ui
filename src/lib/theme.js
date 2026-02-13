import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';

function createThemeStore() {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = () => {
    if (!browser) return 'light';

    const stored = localStorage.getItem('theme');
    if (stored) return stored;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const { subscribe, set } = writable(getInitialTheme());

  return {
    subscribe,
    toggle: () => {
      if (!browser) return;

      const current = localStorage.getItem('theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';

      localStorage.setItem('theme', next);
      document.documentElement.setAttribute('data-theme', next);
      set(next);
    },
    init: () => {
      if (!browser) return;

      const theme = getInitialTheme();
      document.documentElement.setAttribute('data-theme', theme);
      set(theme);
    }
  };
}

export const theme = createThemeStore();
