import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categories } from '../../utils/format.js';
import { describeEvent } from '../../api/events.js';
import { withAssetHost } from '../../utils/format.js';
import './EventForm.css';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  dateTime: z.string(),
  location: z.string().min(2),
  capacity: z.number().min(1),
  category: z.string(),
  image: z.any().optional()
});

const EventForm = ({ defaultValues = {}, onSubmit, loading }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [preview, setPreview] = useState(defaultValues.imageUrl || '');
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });
  const watchValues = watch();

  useEffect(() => {
    const normalizedValues = {
      ...defaultValues,
      dateTime: defaultValues.dateTime ? defaultValues.dateTime.slice(0, 16) : '',
      image: undefined
    };
    reset(normalizedValues);
    if (defaultValues.imageUrl) {
      setPreview(withAssetHost(defaultValues.imageUrl));
    } else {
      setPreview('');
    }
  }, [defaultValues, reset]);

  
  const handleAiAssist = async () => {
    setAiLoading(true);
    try {
      const { data } = await describeEvent({
        title: watchValues.title || 'Event',
        category: watchValues.category || 'General',
        location: watchValues.location || 'your city'
      });
      setValue('description', data.description);
    } catch (error) {
      console.error('Unable to generate description', error);
    } finally {
      setAiLoading(false);
    }
  };

  const onFormSubmit = (values) => {
    const payload = { ...values };
    if (payload.image instanceof FileList && payload.image.length > 0) {
      payload.image = payload.image[0];
    } else {
      delete payload.image;
    }
    onSubmit(payload);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-2">
        <div className="field">
          <label>Title</label>
          <input {...register('title')} />
          {errors.title && <span className="form-error">Title is required</span>}
        </div>
        <div className="field">
          <label>Location</label>
          <input {...register('location')} />
          {errors.location && <span className="form-error">Location is required</span>}
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="field">
          <label>Date & Time</label>
          <input type="datetime-local" {...register('dateTime')} />
        </div>
        <div className="field">
          <label>Capacity</label>
          <input type="number" min={1} {...register('capacity', { valueAsNumber: true })} />
        </div>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea rows={4} {...register('description')} />
        <div className="assist-row">
          <button type="button" className="btn btn-outline" onClick={handleAiAssist} disabled={aiLoading}>
            {aiLoading ? 'Generating…' : 'AI Assist'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <div className="field">
          <label>Category</label>
          <select {...register('category')}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Upload image</label>
          <input
            type="file"
            accept="image/*"
            {...register('image')}
          />
          {preview && <img className="preview" src={preview} alt="preview" />}
        </div>
      </div>
      <input type="hidden" {...register('imageUrl')} />
      <div className="form-actions">
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
