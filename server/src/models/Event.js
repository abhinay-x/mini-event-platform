import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateTime: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    category: { type: String, default: 'General' },
    imageUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    attendeesCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text', location: 'text', category: 'text' });


const Event = mongoose.model('Event', eventSchema);
export default Event;
