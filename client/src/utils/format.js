import dayjs from 'dayjs';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ASSET_BASE = API_BASE.replace(/\/api$/, '');

export const formatDateTime = (value) => dayjs(value).format('ddd, MMM D • h:mm A');
export const formatDateInput = (value) => dayjs(value).format('YYYY-MM-DDTHH:mm');

export const categories = ['General', 'Tech', 'Design', 'Business', 'Wellness', 'Community'];

export const withAssetHost = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${ASSET_BASE}${path}`;
};

export const getCapacityStatus = (event) => {
  const remaining = Math.max(event.capacity - event.attendeesCount, 0);
  if (event.attendeesCount >= event.capacity) {
    return { label: 'Full', variant: 'warn' };
  }

  const threshold = Math.max(1, Math.ceil(event.capacity * 0.2));
  if (remaining <= threshold) {
    return { label: 'Few seats', variant: 'alert' };
  }

  return { label: 'Available', variant: 'success' };
};
