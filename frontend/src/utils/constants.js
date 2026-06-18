export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const ROLES = {
  ADMIN: 'ADMIN',
  STUDENT: 'STUDENT',
};

export const ORDER_STATUSES = ['PLACED', 'PREPARING', 'DELIVERED', 'CANCELLED'];
export const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'FULL_DAY'];
export const MENU_TYPES = ['DAILY', 'WEEKLY'];

export const STATUS_COLORS = {
  PLACED: 'info',
  PREPARING: 'warning',
  DELIVERED: 'success',
  CANCELLED: 'error',
};
