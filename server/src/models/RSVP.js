import mongoose from 'mongoose';

const rsvpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
  },
  { timestamps: true }
);

rsvpSchema.index({ eventId: 1, userId: 1 }, { unique: true });

const RSVP = mongoose.model('RSVP', rsvpSchema);
export default RSVP;
