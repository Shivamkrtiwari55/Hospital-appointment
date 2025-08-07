import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = ["","January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const navigate = useNavigate()

 const slotDateFormat = (slotDate) => {
  if (!slotDate) return "";
  const dateArray = slotDate.split('_'); // assuming format is "7_07_2025"
  const day = parseInt(dateArray[0], 10);
  const monthIndex = parseInt(dateArray[1], 10);
  const year = dateArray[2];
  return `${day} ${months[monthIndex]} ${year}`;
};


  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: {
          token: token, // <-- use 'token' instead of 'Authorization'
        },
      })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments);

      }
      // else {
      // toast.error(data.message || 'Failed to fetch appointments.')
      // }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

    const cancelAppointment = async (appointmentId)=>{
      try {
         
        const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})
        if (data.success) {
          toast.success(data.message)
          getUserAppointments()
          getDoctorsData()

        }else{
          toast.error(data.message)
        }
        

      } catch (error) {
         console.log(error);
      toast.error(error.message)
      }
    }
    
    const initpay = (order)=>{
     
      const options = {
        key:import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency:order.currency,
        name:'Appointment Payment',
        description:'Payment for appointment booking',
        order_id: order.id,
        receipt:order.receipt,
        handler: async (response) => {
        //  console.log(response)

        //  try {
            
        //   const {data} = await axios.post(backendUrl+ '/api/user/verifyRazorpay',response,{headers:{token}})
        //    if (data.success) {
        //      getUserAppointments()
        //      navigate('/my-appointments')
        //    }
        //  } catch (error) {
        //    console.log(error);
        //   toast.error(error.message);
        //  }
        

        }
      }

      const rzp = new window.Razorpay(options);
      rzp.open()
    }

    const appointmentRazorpay = async (appointmentId)=>{
       try {
        
        const {data} = await axios.post(backendUrl + '/api/user/payment-razorpay',{appointmentId},{headers:{token}})
       if (data.success) {
        initpay(data.order) 
       }
         
       } catch (error) {

  console.log(error);
  toast.error(error.message);
       
    }
  }
  

  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData?.image} alt="Doctor" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData?.name}</p>
              <p>{item.docData?.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData?.address?.line1}</p>
              <p className='text-xs'>{item.docData?.address?.line2}</p>
              {/* <p className='text-xs mt-1'> */}
              <p className='text-xs mt-1'>
              <span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}

              </p>
            </div>
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled &&  <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>
                Pay Online
              </button>}
              {!item.cancelled &&  <button onClick={()=> cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>
                Cancel Appointment
              </button>}
              {item.cancelled && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
