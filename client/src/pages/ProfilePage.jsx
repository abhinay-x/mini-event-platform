import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventStore } from '../store/eventStore.js';
import EventCard from '../components/events/EventCard.jsx';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { events, loadEvents, toggleRsvp, removeEvent } = useEventStore();

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const myEvents = events.filter((event) => event.isCreator);
  const attending = events.filter((event) => event.joined && !event.isCreator);

  const handleEdit = (event) => navigate(`/app/events/${event._id}/edit`);

  const handleDelete = async (eventObj) => {
    if (window.confirm('Delete this event?')) {
      await removeEvent(eventObj._id);
    }
  };

  return (
    <section className="profile-page">
      <div className="card">
        <h1>Your dashboard</h1>
        <p>Snapshot of events you created and RSVPed.</p>
      </div>
      <div className="grid profile-grid">
        <div>
          <h2>Created by you</h2>
          <div className="grid events-grid">
            {myEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onToggleRsvp={toggleRsvp}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {myEvents.length === 0 && <p className="muted-text">No events yet.</p>}
        </div>
        <div>
          <h2>You're attending</h2>
          <div className="grid events-grid">
            {attending.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onToggleRsvp={toggleRsvp}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {attending.length === 0 && <p className="muted-text">No RSVP history.</p>}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
