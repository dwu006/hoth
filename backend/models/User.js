import mongoose from 'mongoose';

const taskImageSchema = new mongoose.Schema({
  data: {
    type: Buffer,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  tagId: {
    type: String,
    required: true,
    unique: true,
    length: 7
  },
  password: {
    type: String,
    required: false
  },
  profilePicture: {
    type: Buffer,
    default: null
  },
  sadImg: {
    type: Buffer,
    default: null
  },
  taskImg: [taskImageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for faster queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ tagId: 1 });

const User = mongoose.model('User', userSchema);

export default User;
