import { STORAGE_KEYS, USER_ROLES } from '../utils/constants';
import { initialUsers } from '../data/mockUsers';

function getUsers() {
  const stored = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!stored) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    return initialUsers;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return initialUsers;
  }
}

export const authService = {
  login: async (identifierOrEmail, password) => {
    // Simulate brief network delay
    await new Promise((res) => setTimeout(res, 300));

    const users = getUsers();
    const query = identifierOrEmail.trim().toLowerCase();

    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === query || u.identifier.toLowerCase() === query) &&
        u.password === password
    );

    if (!user) {
      throw new Error('NIM / Email atau Password salah.');
    }

    if (!user.isActive) {
      throw new Error('Akun Anda dinonaktifkan. Silakan hubungi administrator.');
    }

    // Save session (strip password)
    const { password: _, ...sessionUser } = user;
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  },

  getCurrentUser: () => {
    const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => {
    return !!authService.getCurrentUser();
  },

  hasRole: (requiredRole) => {
    const user = authService.getCurrentUser();
    return user && user.role === requiredRole;
  },
};
