import { CalendarDays, ImageOff, MapPin, Users } from 'lucide-react';
import { formatDateTime, getCapacityStatus, withAssetHost } from '../../utils/format.js';
import './EventCard.css';

const EventCard = ({ event, onToggleRsvp, onEdit, onDelete }) => {
  const status = getCapacityStatus(event);
  const ctaLabel = event.joined ? 'Leave event' : status.label === 'Full' ? 'Full' : 'RSVP';
  const ctaDisabled = status.label === 'Full' && !event.joined;

  return (
    <article className="event-card card">
      <div className="event-card__badge-row">
        <span className={`status-chip ${status.variant}`}>{status.label}</span>
        {event.isCreator && <span className="status-chip">You created this</span>}
      </div>
      <div className="event-card__body">
        <div>
          <h3>{event.title}</h3>
          <p className="event-desc">{event.description}</p>
        </div>
        <div className="event-meta">
          <span>
            <CalendarDays size={16} />
            {formatDateTime(event.dateTime)}
          </span>
          <span>
            <MapPin size={16} />
            {event.location}
          </span>
          <span>
            <Users size={16} />
            {event.attendeesCount}/{event.capacity}
          </span>
        </div>
        <div className="event-img">
          {event.imageUrl ? (
            <img src={withAssetHost(event.imageUrl)} alt={event.title} loading="lazy" onError={(event) => {
              event.currentTarget.dataset.failed = true;
            }} />
          ) : (
            <div className="event-img__placeholder">
              <ImageOff size={18} />
              <span>No image</span>
            </div>
          )}
        </div>
      </div>
      <div className="event-card__actions">
        <button className="btn btn-primary" disabled={ctaDisabled} onClick={() => onToggleRsvp(event)}>
          {ctaLabel}
        </button>
        {event.isCreator && (
          <div className="event-card__creator-actions">
            <button className="btn btn-outline" onClick={() => onEdit(event)}>
              Edit
            </button>
            <button className="btn btn-outline" onClick={() => onDelete(event)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default EventCard;
