import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const AllAppointment = () => {
  const { aToken, getAllAppointments, appointments, cancelAppointment } = useContext(AdminContext)
  const { calculateAge, slotDateFormat } = useContext(AppContext)
  const [cancellingId, setCancellingId] = useState('')

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <p className="mb-4 text-xl font-semibold text-gray-800">All Appointments</p>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md overflow-x-auto">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-7 gap-6 font-semibold text-gray-700 border-b border-gray-200 pb-3 text-sm">
          <p>#</p>
          <p>Patient</p>
          <p>Date &amp; Time</p>
          <p>Age</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        {/* Table rows */}
        <div className="divide-y">
          {appointments && appointments.length > 0 ? (
            appointments.map((ap, idx) => (
              <div
                key={ap._id || idx}
                className="grid grid-cols-1 md:grid-cols-7 gap-3 md:gap-6 py-4 text-sm text-gray-700"
              >
                <p className="font-medium md:font-normal">{idx + 1}</p>
                <p>{ap.userData?.name || '—'}</p>
                <p>
                  {slotDateFormat(ap.slotDate)} <br className="md:hidden" />
                  <span className="text-gray-500">{ap.slotTime}</span>
                </p>
                <p>{ap.userData?.dob ? calculateAge(ap.userData.dob) : '—'}</p>

                <p>{ap.docData?.name || '—'}</p>

                <p className="font-medium">₹{ap.amount ?? '—'}</p>

                {
                  ap.cancelled ? (
                    <p className="text-red-600">Cancelled</p>
                  ) : (
                    <div>
                      {cancellingId === ap._id ? (
                        <button className="text-sm text-gray-500">Cancelling...</button>
                      ) : (
                        <img
                          onClick={async () => {
                            const ok = window.confirm('Are you sure you want to cancel this appointment?')
                            if (!ok) return
                            try {
                              setCancellingId(ap._id)
                              await cancelAppointment(ap._id)
                            } finally {
                              setCancellingId('')
                            }
                          }}
                          src={assets.cancel_icon}
                          alt="Cancel"
                          className="w-10 h-10 cursor-pointer"
                        />
                      )}
                    </div>
                  )
                }
                {/*                 
                   <p> 
                  {ap.cancelled ? (
                    <span className="text-red-600">Cancelled</span>
                  ) : ap.isCompleted ? (
                    <span className="text-green-600">Completed</span>
                  ) : (
                    <span className="text-blue-600">{ap.payment ? 'Paid' : 'Pending'}</span>
                  )}
                </p> */}
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">No appointments found.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllAppointment
