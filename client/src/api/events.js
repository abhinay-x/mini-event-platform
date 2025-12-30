import api from './http.js';
import { toFormData } from '../utils/formData.js';

export const fetchEvents = (params = {}) => api.get('/events', { params });
export const fetchEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (payload) => api.post('/events', toFormData(payload), {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateEvent = (id, payload) => api.put(`/events/${id}`, toFormData(payload), {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const rsvpEvent = (id) => api.post(`/events/${id}/rsvp`);
export const cancelRsvp = (id) => api.delete(`/events/${id}/rsvp`);

export const describeEvent = (payload) => api.post('/assist/describe', payload);
