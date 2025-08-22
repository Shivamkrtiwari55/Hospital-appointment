import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorDashboard = () => {
  const { dToken, backendUrl } = useContext(DoctorContext)
  const [appointments, setAppointments] = useState([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (dToken) {
      fetchDoctorData()
    }
  }, [dToken])

  const fetchDoctorData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/profile', { 
        headers: { dtoken: dToken } 
      })
      if (data.success) {
        setProfile(data.doctor)
        setAppointments(data.appointments || [])
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="w-full max-w-6xl m-5">
      <h2 className="text-xl font-semibold mb-4">Doctor Dashboard</h2>

      {/* Doctor Profile Summary */}
      {profile && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={profile.image} 
              alt={profile.name} 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-medium">{profile.name}</h3>
              <p className="text-gray-600">{profile.speciality}</p>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white p-5 rounded-lg shadow-md">
        <p className="mb-3 text-lg font-medium">Your Appointments</p>
        <div className="grid grid-cols-5 gap-4 min-w-[600px] font-semibold text-gray-700 border-b border-gray-200 pb-2">
          <p>#</p>
          <p>Patient</p>
          <p>Date &amp; Time</p>
          <p>Status</p>
          <p>Actions</p>
        </div>

        <div className="divide-y">
          {appointments && appointments.length > 0 ? (
            appointments.map((ap, idx) => (
              <div key={ap._id || idx} className="grid grid-cols-5 gap-4 min-w-[600px] py-3 items-center text-sm text-gray-700">
                <p>{idx + 1}</p>
                <p className="truncate">{ap.userData?.name || '—'}</p>
                <p className="truncate">{ap.slotDate} {ap.slotTime}</p>
                <p className={
                  ap.cancelled ? 'text-red-600' : 
                  ap.isCompleted ? 'text-green-600' : 
                  'text-blue-600'
                }>
                  {ap.cancelled ? 'Cancelled' : ap.isCompleted ? 'Completed' : 'Upcoming'}
                </p>
                <button 
                  className={`px-3 py-1 rounded ${
                    !ap.cancelled && !ap.isCompleted 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-500'
                  }`}
                  disabled={ap.cancelled || ap.isCompleted}
                >
                  Complete
                </button>
              </div>
            ))
          ) : (
            <div className="py-6 text-gray-500">No appointments found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
