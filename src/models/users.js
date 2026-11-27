import User from './schemas/users.js';

export async function getAllUsers() {
  return User.find({}).populate('role').lean();
}

export async function getUserById(id) {
  return User.findById(id).populate('role').lean();
}

export async function updateUserById(id, updates) {
  return User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  }).populate('role').lean();
}

export async function deleteUserById(id) {
  return User.findByIdAndDelete(id).lean();
}
