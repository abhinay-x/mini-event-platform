import Event from '../models/Event.js';
import RSVP from '../models/RSVP.js';

const buildImageUrl = (file, fallback) => {
  if (file) {
    return `/uploads/${file.filename}`;
  }
  return fallback || '';
};

const normalizeBoolean = (value) => value === 'true' || value === true;

export const createEvent = async (req, res) => {
  const { title, description, dateTime, location, capacity, category = 'General', imageUrl } = req.body;

  if (!title || !description || !dateTime || !location || !capacity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const event = await Event.create({
    title,
    description,
    dateTime,
    location,
    capacity: Number(capacity),
    category,
    imageUrl: buildImageUrl(req.file, imageUrl),
    createdBy: req.user._id
  });

  res.status(201).json(event);
};

export const getEvents = async (req, res) => {
  const { search, category, dateFrom, dateTo, mine, attending, includePast } = req.query;

  const filter = {};
  const now = new Date();
  if (!normalizeBoolean(includePast)) {
    filter.dateTime = { $gte: now };
  }
  if (dateFrom || dateTo) {
    filter.dateTime = filter.dateTime || {};
    if (dateFrom) filter.dateTime.$gte = new Date(dateFrom);
    if (dateTo) filter.dateTime.$lte = new Date(dateTo);
  }
  if (category && category !== 'all') {
    filter.category = category;
  }
  if (search) {
    filter.$text = { $search: search };
  }
  if (normalizeBoolean(mine)) {
    filter.createdBy = req.user._id;
  }

  const events = await Event.find(filter).sort('dateTime');
  const rsvps = await RSVP.find({ userId: req.user._id }).select('eventId');
  const joinedSet = new Set(rsvps.map((entry) => entry.eventId.toString()));

  const filteredEvents = normalizeBoolean(attending)
    ? events.filter((event) => joinedSet.has(event._id.toString()))
    : events;

  const payload = filteredEvents.map((event) => {
    const obj = event.toObject();
    const isFull = obj.attendeesCount >= obj.capacity;
    return {
      ...obj,
      joined: joinedSet.has(obj._id.toString()),
      isFull,
      isCreator: obj.createdBy.toString() === req.user._id.toString()
    };
  });
  res.json(payload);
};

const ensureCreator = (event, userId) => {
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }
  if (event.createdBy.toString() !== userId.toString()) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }
};

export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  const userRsvp = await RSVP.findOne({ eventId: event._id, userId: req.user._id });
  const payload = {
    ...event.toObject(),
    joined: Boolean(userRsvp),
    isFull: event.attendeesCount >= event.capacity,
    isCreator: event.createdBy.toString() === req.user._id.toString()
  };
  res.json(payload);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  ensureCreator(event, req.user._id);

  const updatableFields = ['title', 'description', 'dateTime', 'location', 'category'];
  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      event[field] = req.body[field];
    }
  });
  if (req.body.capacity !== undefined) {
    event.capacity = Number(req.body.capacity);
  }
  if (req.file || req.body.imageUrl) {
    event.imageUrl = buildImageUrl(req.file, req.body.imageUrl);
  }

  await event.save();
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  ensureCreator(event, req.user._id);

  await RSVP.deleteMany({ eventId: event._id });
  await event.deleteOne();
  res.json({ message: 'Event deleted' });
};
