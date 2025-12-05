import { writable } from 'svelte/store';

const TOKEN_KEY = 'scrob_token';
const USERNAME_KEY = 'scrob_username';

function createAuthStore() {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedUsername = localStorage.getItem(USERNAME_KEY);

  const { subscribe, set, update } = writable({
    token: storedToken,
    username: storedUsername,
    isAuthenticated: !!storedToken,
  });

  return {
    subscribe,
    login: (token, username) => {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USERNAME_KEY, username);
      set({
        token,
        username,
        isAuthenticated: true,
      });
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USERNAME_KEY);
      set({
        token: null,
        username: null,
        isAuthenticated: false,
      });
    },
  };
}

export const auth = createAuthStore();
