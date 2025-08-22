import express from 'express'
import {
  doctorList,
  logindoctor,
  doctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  updateDoctorProfile
} from '../controllers/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', logindoctor)
doctorRouter.get('/profile', authDoctor, doctorProfile)
doctorRouter.put('/update-profile', authDoctor, updateDoctorProfile)
doctorRouter.get('/appointments', authDoctor, getDoctorAppointments)
doctorRouter.put('/appointments/:id', authDoctor, updateAppointmentStatus)

export default doctorRouter