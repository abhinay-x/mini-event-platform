import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EventForm from '../components/forms/EventForm.jsx';
import { useEventStore } from '../store/eventStore.js';
import './EventFormPage.css';

const EventFormPage = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentEvent, loadEvent, clearCurrent, saveEvent, loading } = useEventStore();

  useEffect(() => {
    if (mode === 'edit' && id) {
      loadEvent(id);
    }
    return () => clearCurrent();
  }, [mode, id, loadEvent, clearCurrent]);

  const defaultValues = useMemo(() => {
    if (mode === 'edit' && currentEvent) {
      return {
        title: currentEvent.title,
        description: currentEvent.description,
        dateTime: currentEvent.dateTime,
        location: currentEvent.location,
        capacity: currentEvent.capacity,
        category: currentEvent.category,
        imageUrl: currentEvent.imageUrl
      };
    }
    return {
      title: '',
      description: '',
      dateTime: '',
      location: '',
      capacity: 20,
      category: 'General'
    };
  }, [mode, currentEvent]);

  const pageTitle = mode === 'edit' ? 'Edit event' : 'Create new event';

  const handleSubmit = async (values) => {
    try {
      await saveEvent(values, mode === 'edit' ? id : undefined);
      navigate('/app');
    } catch (error) {
      console.error('Unable to save event', error);
    }
  };

  return (
    <section className="event-form-page">
      <div className="card">
        <h1>{pageTitle}</h1>
        <p>Create meaningful experiences with image uploads, AI descriptions, and capacity-safe RSVPs.</p>
        <EventForm defaultValues={defaultValues} loading={loading} onSubmit={handleSubmit} />
      </div>
    </section>
  );
};

export default EventFormPage;
