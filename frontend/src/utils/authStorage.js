const TOKEN_KEY = 'token';
const USER_KEY = 'user';

/** Session-only auth storage — new browser tabs require login again. */
export const authStorage = {
  getToken: () => sessionStorage.getItem(TOKEN_KEY),

  setToken: (token) => sessionStorage.setItem(TOKEN_KEY, token),

  getUser: () => {
    const stored = sessionStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  setUser: (user) => sessionStorage.setItem(USER_KEY, JSON.stringify(user)),

  clear: () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
