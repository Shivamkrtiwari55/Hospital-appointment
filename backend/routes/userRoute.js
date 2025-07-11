import express from 'express';
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  getUserAppointments,
  cancleAppointment

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
userRouter.get('/list-appointments',authUser,listAppointment)
userRouter.get('/appointments',authUser,getUserAppointments);
userRouter.post('/cancle-appointment',authUser,cancleAppointment)
 // ⬅️ use PUT for updates

export default userRouter;
