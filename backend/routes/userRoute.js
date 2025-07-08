import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
} from '../controllers/userControllers.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

// Public Routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected Routes
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);


 // ⬅️ use PUT for updates

export default userRouter;
