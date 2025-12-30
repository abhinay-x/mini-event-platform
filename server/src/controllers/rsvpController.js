import mongoose from 'mongoose';
import Event from '../models/Event.js';
import RSVP from '../models/RSVP.js';

export const joinEvent = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();

  try {
    let updatedEvent;
    await session.withTransaction(async () => {
      const existing = await RSVP.findOne({ eventId: id, userId: req.user._id }).session(session);
      if (existing) {
        throw new Error('ALREADY_JOINED');
      }

      updatedEvent = await Event.findOneAndUpdate(
        { _id: id, $expr: { $lt: ['$attendeesCount', '$capacity'] } },
        { $inc: { attendeesCount: 1 } },
        { new: true, session }
      );

      if (!updatedEvent) {
        throw new Error('EVENT_FULL');
      }

      await RSVP.create([{ eventId: id, userId: req.user._id }], { session });
    });

    return res.status(201).json({ message: 'RSVP confirmed', event: updatedEvent });
  } catch (error) {
    if (error.message === 'EVENT_FULL') {
      return res.status(400).json({ message: 'Event is full or does not exist' });
    }
    if (error.message === 'ALREADY_JOINED' || error.code === 11000) {
      return res.status(400).json({ message: 'Already joined' });
    }
    console.error('RSVP error', error);
    return res.status(500).json({ message: 'Could not RSVP' });
  } finally {
    await session.endSession();
  }
};

export const leaveEvent = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const deleted = await RSVP.findOneAndDelete({ eventId: id, userId: req.user._id }).session(session);
      if (!deleted) {
        throw new Error('RSVP_NOT_FOUND');
      }

      const event = await Event.findByIdAndUpdate(
        id,
        { $inc: { attendeesCount: -1 } },
        { new: true, session }
      );

      if (event && event.attendeesCount < 0) {
        event.attendeesCount = 0;
        await event.save({ session, validateBeforeSave: false });
      }
    });

    res.json({ message: 'Left the event' });
  } catch (error) {
    if (error.message === 'RSVP_NOT_FOUND') {
      return res.status(404).json({ message: 'RSVP not found' });
    }
    console.error('Leave RSVP error', error);
    return res.status(500).json({ message: 'Could not cancel RSVP' });
  } finally {
    await session.endSession();
  }
};
