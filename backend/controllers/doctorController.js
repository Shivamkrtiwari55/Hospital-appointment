import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const changeAvailablity = async (req,res) => {
    try {
        
      const {docId} = req.body

      const docData = await doctorModel.findById(docId)

      await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
      res.json({success:true,message: 'Availablity Changed'})
      
    } catch (error) {
       console.error(error);
    res.json({ success: false, message: error.message }); 
    }

}

const doctorList = async (req,res) => {
  try {
    const doctors = await doctorModel.find({}).select(['-password','-email'])

   res.json({success:true,doctors})

  } catch (error) {
     console.error(error);
    res.json({ success: false, message: error.message }); 
  }
}
  

  // API for doctor login
  const logindoctor = async (req,res) =>{
    try {
  
      const {email,password} = req.body
      const doctor = await doctorModel.findOne({email})

      if (!doctor) {
        return res.json({success:false,message:'Invalid credentials'})
      }

      const isMatch = await bcrypt.compare(password,doctor.password)
      if (isMatch) {
        const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)

        res.json({success:true,token})
      } else{
        return res.json({success:false,message:'Invalid credentials'})
      }

      
    } catch (error) {
       console.error(error);
    res.json({ success: false, message: error.message });
    }
  }

const doctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findById(req.doctorId).select('-password')
    res.json({
      success: true,
      doctor
    })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

const updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await doctorModel.findByIdAndUpdate(
      req.doctorId,
      {
        name: req.body.name,
        email: req.body.email,
        speciality: req.body.speciality,
        degree: req.body.degree,
        experience: req.body.experience,
        fees: req.body.fees,
        about: req.body.about,
        address: req.body.address
      },
      { new: true }
    )
    res.json({
      success: true,
      message: 'Profile updated successfully',
      doctor
    })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

const getDoctorAppointments = async (req, res) => {
  try {
    // Find appointments for this doctor
    const appointments = await appointmentModel
      .find({ docId: req.doctorId })
      .sort({ date: -1 })
      .populate('userId', 'name email')

    // Transform appointments data
    const formattedAppointments = appointments.map(app => ({
      _id: app._id,
      patientName: app.userData?.name || app.userId?.name,
      patientEmail: app.userData?.email || app.userId?.email,
      slotDate: app.slotDate,
      slotTime: app.slotTime,
      status: app.status || (app.cancelled ? 'cancelled' : app.payment ? 'completed' : 'pending'),
      fees: app.amount,
      paymentStatus: app.payment ? 'paid' : 'pending'
    }))

    res.json({
      success: true,
      appointments: formattedAppointments
    })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Verify the appointment belongs to this doctor
    const appointment = await appointmentModel.findOne({
      _id: id,
      docId: req.doctorId
    })

    if (!appointment) {
      return res.json({
        success: false,
        message: 'Appointment not found'
      })
    }

    // Validate status transition
    const validTransitions = {
      pending: ['approved', 'cancelled'],
      approved: ['completed', 'cancelled'],
      completed: [],
      cancelled: []
    }

    if (!validTransitions[appointment.status].includes(status)) {
      return res.json({
        success: false,
        message: 'Invalid status transition'
      })
    }

    appointment.status = status
    await appointment.save()

    res.json({
      success: true,
      message: 'Appointment status updated successfully'
    })
  } catch (error) {
    console.error(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  changeAvailablity,
  doctorList,
  logindoctor,
  doctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus
}