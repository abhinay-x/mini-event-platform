import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore.js';
import EventCard from '../components/events/EventCard.jsx';
import EventFilters from '../components/events/EventFilters.jsx';
import StatsPanel from '../components/dashboard/StatsPanel.jsx';
import './EventsPage.css';

const EventsPage = () => {
  const navigate = useNavigate();
  const {
    events,
    filters,
    loading,
    error,
    stats,
    loadEvents,
    setFilter,
    resetFilters,
    toggleRsvp,
    removeEvent
  } = useEventStore();

  useEffect(() => {
    loadEvents();
  }, [filters, loadEvents]);

  const handleEdit = (event) => navigate(`/app/events/${event._id}/edit`);
  const handleDelete = async (eventObj) => {
    if (window.confirm('Delete this event?')) {
      await removeEvent(eventObj._id);
    }
  };

  return (
    <section className="events-page">
      <div className="hero card">
        <h1>Plan, promote, and protect your events.</h1>
        <p>
          Full CRUD, AI-assisted descriptions, safe RSVPs, and responsive dashboards. Search, filter, and act on upcoming
          experiences in one place.
        </p>
      </div>

      <StatsPanel stats={stats()} />

      <EventFilters filters={filters} onChange={setFilter} onReset={resetFilters} />

      {loading && <p className="muted-text">Loading events…</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="grid events-grid">
        {events.map((event) => (
          <EventCard
            key={event._id}
            event={event}
            onToggleRsvp={toggleRsvp}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {!loading && events.length === 0 && <p className="muted-text">No events match these filters yet.</p>}
    </section>
  );
};

export default EventsPage;
