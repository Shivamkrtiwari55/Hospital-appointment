import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { format } from 'date-fns'

const DoctorAppointment = () => {
  const { dToken, backendUrl } = useContext(DoctorContext)
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState('all') // all, pending, approved, completed, cancelled

  useEffect(() => {
    if (dToken) {
      fetchAppointments()
    }
  }, [dToken])

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
        headers: { dtoken: dToken }
      })
      if (data.success) {
        setAppointments(data.appointments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        backendUrl + '/api/doctor/appointments/' + appointmentId,
        { status },
        { headers: { dtoken: dToken } }
      )
      if (data.success) {
        toast.success('Appointment status updated')
        fetchAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true
    return appointment.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="w-full max-w-6xl m-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Appointments</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${
              filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded ${
              filter === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded ${
              filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded ${
              filter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.map((appointment) => (
              <tr key={appointment._id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.patientEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {appointment.slotDate.split('_').join(' ')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.slotTime}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  ₹{appointment.fees}
                  <div className={`text-xs ${appointment.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {appointment.paymentStatus}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  {appointment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(appointment._id, 'approved')}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {appointment.status === 'approved' && (
                    <button
                      onClick={() => handleStatusChange(appointment._id, 'completed')}
                      className="text-green-600 hover:text-green-900"
                    >
                      Mark Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DoctorAppointment

