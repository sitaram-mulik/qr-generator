import express from 'express';
import {
  getProfile,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserStatus,
  getUser
} from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { superAdminCheck } from '../middleware/admin.middleware.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/all', authenticateToken, superAdminCheck, getUsers);
router.post('/create', authenticateToken, superAdminCheck, createUser);
router.post('/update', authenticateToken, superAdminCheck, updateUser);
router.delete('/delete', authenticateToken, superAdminCheck, deleteUser);
router.post('/toggleStatus', authenticateToken, superAdminCheck, changeUserStatus);
router.get('/:userId', authenticateToken, superAdminCheck, getUser);

export default router;
