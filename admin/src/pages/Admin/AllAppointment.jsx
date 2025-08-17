import React from 'react'
// import { AdminContext } from '../../context/AdminContext'
// import { useContext } from 'react'
// import { useEffect } from 'react'
// const { AppContext } = require('../../context/AppContext')

const AllAppointment = () => {
  const { aToken, getAllAppointments, appointments } = useContext(AdminContext)
  const { calculateAge } = useContext(AppContext)
  useEffect(() => {
    if (!aToken) {
      getAllAppointments()
    }

  }, [aToken])
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>
      <div className="bg-white p-5 rounded-lg shadow-md overflow-x-auto">
        <div className="grid grid-cols-7 gap-4 min-w-[600px] font-semibold text-gray-700 border-b border-gray-200 pb-2">
          <p>#</p>
          <p>Patient</p>
          <p>Date &amp; Time</p>
          <p>Age</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Actions</p>
        </div>
       
      </div>
    </div>




  )
}

export default AllAppointment
