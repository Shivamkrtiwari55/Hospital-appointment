import express from 'express';
import { bookAppointment } from '../controllers/userControllers.js'; // or appointmentController.js if you separate later
import authUser from '../middleware/authUser.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/book-appointment', authUser, bookAppointment);

export default appointmentRouter;
