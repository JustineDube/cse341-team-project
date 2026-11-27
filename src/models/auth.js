import bcrypt from 'bcrypt';
import Role from './schemas/roles.js';
import User from './schemas/users.js';

export async function createUser({ displayName, username, email, password }) {
  const customerRole = await Role.findOne({ name: 'customer' });
  if (!customerRole) {
    throw new Error('Customer role is not configured');
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    displayName,
    username,
    email,
    passwordHash,
    role: customerRole._id
  });
  return user;
}

export async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase().trim() }).populate('role');
}

export async function findUserByUsername(username) {
  return User.findOne({ username: username.toLowerCase().trim() }).populate('role');
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}
