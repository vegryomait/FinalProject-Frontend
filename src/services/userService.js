import { STORAGE_KEYS } from '../utils/constants';
import { initialUsers } from '../data/mockUsers';

export const userService = {
  getUsers: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
      return initialUsers;
    }
    try {
      return JSON.parse(data);
    } catch {
      return initialUsers;
    }
  },

  toggleUserStatus: (userId) => {
    const users = userService.getUsers();
    const updated = users.map((u) => {
      if (u.id === userId) {
        return { ...u, isActive: !u.isActive };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    return updated;
  },

  resetUsers: () => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
    return initialUsers;
  }
};
