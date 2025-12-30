import mongoose from 'mongoose';

const FALLBACK_LOCAL_URI = 'mongodb://127.0.0.1:27017/event_management';

const getMongoUri = () => {
  const uri = process.env.MONGO_URI?.trim();

  if (!uri) {
    throw new Error('MONGO_URI must be defined in .env');
  }

  if (uri.includes('<') || uri.includes('>')) {
    console.warn(
      'Detected placeholder-style credentials in MONGO_URI. Falling back to local MongoDB URI;' +
        ' replace the placeholder with your Atlas connection string to connect to your cluster.'
    );
    return process.env.MONGO_URI_FALLBACK?.trim() || FALLBACK_LOCAL_URI;
  }

  return uri;
};

const connectDB = async () => {
  const mongoUri = getMongoUri();

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
