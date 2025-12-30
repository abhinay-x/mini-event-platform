import { create } from 'zustand';
import dayjs from 'dayjs';
import {
  fetchEvents,
  fetchEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
  cancelRsvp
} from '../api/events.js';

const defaultFilters = {
  search: '',
  category: 'all',
  datePreset: 'upcoming',
  dateFrom: '',
  dateTo: '',
  showMine: false,
  showAttending: false,
  includePast: false
};

const computePresetRange = (preset) => {
  const now = dayjs();
  switch (preset) {
    case 'today':
      return { dateFrom: now.startOf('day').toISOString(), dateTo: now.endOf('day').toISOString() };
    case 'week':
      return { dateFrom: now.startOf('week').toISOString(), dateTo: now.endOf('week').toISOString() };
    case 'upcoming':
      return { dateFrom: now.startOf('day').toISOString() };
    case 'custom':
      return {};
    default:
      return {};
  }
};

const normalizeDateInput = (value, endOfDay = false) => {
  if (!value) return undefined;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return undefined;
  const normalized = endOfDay ? parsed.endOf('day') : parsed.startOf('day');
  return normalized.toISOString();
};

export const useEventStore = create((set, get) => ({
  events: [],
  currentEvent: null,
  filters: defaultFilters,
  listLoading: false,
  actionLoading: false,
  error: null,

  setFilter: (name, value) =>
    set((state) => {
      const nextFilters = { ...state.filters, [name]: value };

      if (name === 'datePreset') {
        if (value !== 'custom') {
          nextFilters.dateFrom = '';
          nextFilters.dateTo = '';
        }
      }

      if (name === 'dateFrom' || name === 'dateTo') {
        if (value) {
          nextFilters.datePreset = 'custom';
        } else if (!nextFilters.dateFrom && !nextFilters.dateTo) {
          nextFilters.datePreset = 'upcoming';
        }
      }

      if (name === 'includePast' && value) {
        if (!nextFilters.dateFrom && !nextFilters.dateTo && nextFilters.datePreset === 'upcoming') {
          nextFilters.datePreset = 'all';
        }
      }

      if (name === 'search' && typeof value === 'string') {
        nextFilters.search = value;
      }

      return { filters: nextFilters };
    }),
  resetFilters: () => set({ filters: defaultFilters }),

  loadEvents: async () => {
    const { filters } = get();
    set({ listLoading: true, error: null });
    try {
      const presetRange = computePresetRange(filters.datePreset);
      const manualFrom = normalizeDateInput(filters.dateFrom);
      const manualTo = normalizeDateInput(filters.dateTo, true);

      let dateFrom = manualFrom ?? presetRange.dateFrom;
      let dateTo = manualTo ?? presetRange.dateTo;

      if (filters.includePast && !manualFrom && filters.datePreset !== 'custom') {
        dateFrom = undefined;
      }

      if (dateFrom && dateTo && dayjs(dateTo).isBefore(dayjs(dateFrom))) {
        dateTo = undefined;
      }

      const trimmedSearch = filters.search.trim();
      const params = {
        search: trimmedSearch ? trimmedSearch : undefined,
        category: filters.category === 'all' ? undefined : filters.category,
        dateFrom,
        dateTo,
        mine: filters.showMine ? true : undefined,
        attending: filters.showAttending ? true : undefined,
        includePast: filters.includePast ? true : undefined
      };
      const { data } = await fetchEvents(params);
      set({ events: data });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Unable to load events' });
    } finally {
      set({ listLoading: false });
    }
  },

  loadEvent: async (id) => {
    set({ actionLoading: true, error: null });
    try {
      const { data } = await fetchEvent(id);
      set({ currentEvent: data });
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to fetch event';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ actionLoading: false });
    }
  },

  clearCurrent: () => set({ currentEvent: null }),

  saveEvent: async (payload, id) => {
    set({ actionLoading: true, error: null });
    try {
      if (id) {
        await updateEvent(id, payload);
      } else {
        await createEvent(payload);
      }
      await get().loadEvents();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to save event';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ actionLoading: false });
    }
  },

  removeEvent: async (id) => {
    set({ actionLoading: true, error: null });
    try {
      await deleteEvent(id);
      set((state) => ({ events: state.events.filter((event) => event._id !== id) }));
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete event';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ actionLoading: false });
    }
  },

  toggleRsvp: async (event) => {
    set({ actionLoading: true, error: null });
    try {
      if (event.joined) {
        await cancelRsvp(event._id);
      } else {
        await rsvpEvent(event._id);
      }
      await get().loadEvents();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to update RSVP';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ actionLoading: false });
    }
  },

  stats: () => {
    const { events } = get();
    const upcoming = events.filter((event) => dayjs(event.dateTime).isAfter(dayjs().subtract(1, 'minute')));
    const myEvents = events.filter((event) => event.isCreator);
    const attending = events.filter((event) => event.joined);
    return {
      total: events.length,
      upcoming: upcoming.length,
      myEvents: myEvents.length,
      attending: attending.length
    };
  }
}));
