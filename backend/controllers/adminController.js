import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
import appointmentModels from "../models/appointmentModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (
      !name || !email || !password || !speciality || !degree ||
      !experience || !about || fees === undefined || fees === null ||
      !address || !imageFile
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }


    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
      folder: "doctors", // optional but recommended
    });
    const imageUrl = imageUpload.secure_url;

    // Parse address
    let parsedAddress;
    try {
      parsedAddress = JSON.parse(address);
    } catch (err) {
      return res.json({ success: false, message: "Invalid address format" });
    }

    // Build doctor data
    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      date: Date.now(),
    };

    // Save to DB
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// api for the admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {

      const token = jwt.sign(email + password, process.env.JWT_SECRET)
      res.json({ success: true, token })


    } else {
      res.json({ success: false, message: "Invalid credentials" })
    }

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}
// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password')
    res.json({ success: true, doctors })


  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// Api to get all apponitment list for admin panel
const appointmentsAdmin = async (req, res) => {

  try {
    const appointments = await appointmentModels.find({})
    res.json({ success: true, appointments })

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}
// api for aapointment cancel 
const appointmentCancel = async (req, res) => {
  try {
       
    const { appointmentId } = req.body;    // only need the appointment id

    const appointmentData = await appointmentModel.findById(appointmentId);
    // Mark appointment as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

    // ── Release the doctor’s slot ───────────────────────────
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);
    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] =
        doctorData.slots_booked[slotDate].filter(t => t !== slotTime);
      await doctorModel.findByIdAndUpdate(docId, { slots_booked: doctorData.slots_booked });
    }

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// api to get dashboard

const adminDashboard = async (req, res) => {

  try {
    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      doctors:doctors.length,
      appointments:appointments.length,
      patients:users.length,
      lastestAppointments: appointments.slice(0,5).reverse(), // Get last 5 appointments
    }
    res.json({ success: true, dashData });

  } catch (error) {
    console.log(error);
    
    res.json({success:false , message: error.message })
  }
}
  
export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin,appointmentCancel ,adminDashboard};
