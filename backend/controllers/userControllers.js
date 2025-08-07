import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay';

// API to register user

const registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" })

    }
    // validating email formate
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" })

    }
    // validating strong password

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" })
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const userData = {
      name,
      email,
      password: hashedPassword
    }

    const newUser = new userModel(userData)
    const user = await newUser.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })





  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}
// API for user login

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }


  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ Direct access, no destructuring
    const userData = await userModel.findById(userId).select('-password');
    res.json({ success: true, userData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile data
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ← Get from token (middleware)
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender || !address) {
      return res.json({ success: false, message: "Data Missing" });
    }

    const updatedFields = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    };

    // If image uploaded, upload to Cloudinary
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image'
      });
      updatedFields.image = imageUpload.secure_url;
    }

    await userModel.findByIdAndUpdate(userId, updatedFields, { new: true });

    res.json({ success: true, message: "Profile Updated" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment
// const bookAppointment = async (req, res) =>{
//   try {
//    const userId = req.user.id;
// const { docId, slotDate, slotTime } = req.body;



//      const docData = await doctorModel.findById(docId).select('-password')

//      if (!docData.available) {
//       return res.json({success:false,message:"Doctor not available"})

//      }

//      let slots_booked = docData.slots_booked

//      // checking for slot availabilty
//      if (slots_booked[slotDate]) {
//        if(slots_booked[slotDate].includes(slotTime)){
//         return res.json({success:false,message:"Slot not available"})

//        }else{
//         slots_booked[slotDate].push(slotTime)
//        }
//      }else{
//       slots_booked[slotDate] = [slotTime]
//       slots_booked[slotDate].push(slotTime)
//      }

//      const userData = await userModel.findById(userId).select('-password')

//       delete docData.slots_booked

//       const appointmentData = {
//         userId,
//         docId,
//         userData,
//         docData,
//         amount: docData.fees,
//         slotDate,
//         date:Date.now()
//       }

//       const newAppointment = new appointmentModel(appointmentData)
//       await newAppointment.save()

// // save new slot data in docData
//  await doctorModel.findByIdAndUpdate(docId,{slots_booked})
//   res.json({success:true,message:"Appointment booked successfully"})

//   } catch (error) {
//      console.error(error);
//     res.json({ success: false, message: error.message });
//   }
// }

const bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select('-password');
    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked || {};

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      // slots_booked[slotDate]=[]
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await userModel.findById(userId).select('-password');
    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const getUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({ userId: req.user.id });
    res.json({ success: true, appointments: appointments || [] });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// // API to get user appointment for frontend my-appointment page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body
    const appointments = await appointmentModel.find({ userId })

    res.json({ success: true, appointments })

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
}
// API – cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.user.id;      // ✅ take from JWT, not body
    const { appointmentId } = req.body;    // only need the appointment id

    const appointmentData = await appointmentModel.findById(appointmentId);
    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // Authorisation check (stringify both sides)
    if (appointmentData.userId.toString() !== userId.toString()) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

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
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make  payment of appointment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)
    if (!appointmentData || appointmentData.cancelled) {
      return res.json({ success: false, message: "Appointment Cancelled" })
    }
    // Creating option for razorpay payment

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    }
    // creation of an order
    const order = await razorpayInstance.orders.create(options)
    res.json({ success: true, order })


  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }


}
// API to verify payment of razorpay
const verifyRazorpay = async (req,res)=>{
  try {
    
   const {razorpay_order_id} = req.body;
   const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
   if (orderInfo.status === 'paid') {
     await  appointmentModel.findOneAndUpdate(orderInfo.receipt,{payment:true})
     res.json({success:true,messaage:"Payment successful"})
   }else{
      res.json({success:false,message:"Payment failed"})
   }
   


  } catch (error) {
     console.error(error);
    res.json({ success: false, message: error.message });
  }
}


export { registerUser, loginUser, getProfile, updateProfile,
   bookAppointment, listAppointment,
   
   getUserAppointments, cancelAppointment, 
   paymentRazorpay,verifyRazorpay };