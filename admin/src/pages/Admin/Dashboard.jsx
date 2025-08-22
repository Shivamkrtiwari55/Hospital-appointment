import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {

  const { aToken, getDashData, dashData } = useContext(AdminContext)
   const {slotDateFormat}  = useContext(AppContext)
  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return (
    <div className="w-full max-w-6xl m-5">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Doctors</p>
          <img src={assets.doctor_icon} alt="" />
          <p className="text-2xl font-bold">{dashData ? dashData.doctors : '—'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Appointments</p>
          <img src={assets.appointments_icon} alt="" />
          <p className="text-2xl font-bold">{dashData ? dashData.appointments : '—'}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Patients</p>
          <img src={assets.patients_icon} alt="" />
          <p className="text-2xl font-bold">{dashData ? dashData.patients : '—'}</p>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-md">
        <p className="mb-3 text-lg font-medium">Latest Appointments</p>
        <div className="grid grid-cols-5 gap-4 min-w-[600px] font-semibold text-gray-700 border-b border-gray-200 pb-2">
          <p>#</p>
          <p>Patient</p>
          <p>Date &amp; Time</p>
          <p>Doctor</p>
          <p>Appointment Cancelled</p>
        </div>

        <div className="divide-y">
          {dashData && dashData.lastestAppointments && dashData.lastestAppointments.length > 0 ? (
            dashData.lastestAppointments.map((ap, idx) => (
              <div key={ap._id || idx} className="grid grid-cols-5 gap-4 min-w-[600px] py-3 items-center text-sm text-gray-700">
                <p>{idx + 1}</p>
                <p className="truncate">{ap.userData?.name || '—'}</p>
                <p className="truncate">{slotDateFormat(ap.slotDate)} {ap.slotTime}</p>
                <p className="truncate">{ap.docData?.name || '—'}</p>
                <p>{ap.cancelled ? 'Yes' : 'No'}</p>
              </div>
            ))
          ) : (
            <div className="py-6 text-gray-500">No recent appointments.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
