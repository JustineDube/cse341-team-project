import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['customer', 'admin'],
    unique: true,
    required: true,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
