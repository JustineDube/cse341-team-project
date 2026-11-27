import mongoose from 'mongoose';
import { getAllUsers, getUserById, updateUserById, deleteUserById } from '../models/users.js';

const isValidId = (id) => mongoose.isValidObjectId(id);

export const userAdminPage = (req, res) => {
  res.render('admin/users', { title: 'User Administration' });
};

export const getUsers = async (req, res) => {
  try {
    const users = req.user.role === 'admin'
      ? await getAllUsers()
      : [await getUserById(req.user.id)].filter(Boolean);
    return res.status(200).json({
      users: users.map((user) => ({
        id: user._id,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        role: user.role?.name
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Unable to fetch users' });
  }
};

const canManageUser = (req, targetId) =>
  req.user.role === 'admin' || req.user.id === targetId;

export const updateUser = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }
  if (!canManageUser(req, req.params.id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const allowed = {};
  for (const field of ['displayName', 'username', 'email']) {
    if (req.body[field] !== undefined) allowed[field] = req.body[field];
  }
  try {
    const user = await updateUserById(req.params.id, allowed);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({
      user: {
        id: user._id,
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        role: user.role?.name
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Unable to update user' });
  }
};

export const deleteUser = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid user id' });
  }
  if (!canManageUser(req, req.params.id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const deleted = await deleteUserById(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Unable to delete user' });
  }
};
