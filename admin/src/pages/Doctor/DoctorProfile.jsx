import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {
  const { dToken, backendUrl } = useContext(DoctorContext)
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    speciality: '',
    degree: '',
    experience: '',
    about: '',
    fees: '',
    address: { line1: '', line2: '' }
  })

  useEffect(() => {
    if (dToken) {
      fetchProfile()
    }
  }, [dToken])

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
        headers: { dtoken: dToken }
      })
      if (data.success) {
        setProfile(data.doctor)
        setFormData({
          name: data.doctor.name,
          email: data.doctor.email,
          speciality: data.doctor.speciality,
          degree: data.doctor.degree,
          experience: data.doctor.experience,
          about: data.doctor.about,
          fees: data.doctor.fees,
          address: data.doctor.address || { line1: '', line2: '' }
        })
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(
        backendUrl + '/api/doctor/update-profile',
        formData,
        { headers: { dtoken: dToken } }
      )
      if (data.success) {
        toast.success('Profile updated successfully')
        setIsEditing(false)
        fetchProfile()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  if (!profile) return <div className="p-4">Loading...</div>

  return (
    <div className="w-full max-w-6xl m-5">
      <h2 className="text-xl font-semibold mb-4">Doctor Profile</h2>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-6 mb-6">
          <img
            src={profile.image}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h3 className="text-2xl font-medium">{profile.name}</h3>
            <p className="text-gray-600">{profile.speciality}</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="ml-auto px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Speciality</label>
                <input
                  type="text"
                  value={formData.speciality}
                  onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fees</label>
                <input
                  type="number"
                  value={formData.fees}
                  onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                  className="mt-1 p-2 w-full border rounded"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">About</label>
              <textarea
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="mt-1 p-2 w-full border rounded"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                value={formData.address.line1}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, line1: e.target.value }
                })}
                className="mt-1 p-2 w-full border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
              <input
                type="text"
                value={formData.address.line2}
                onChange={(e) => setFormData({
                  ...formData,
                  address: { ...formData.address, line2: e.target.value }
                })}
                className="mt-1 p-2 w-full border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>{profile.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Speciality</h4>
                <p>{profile.speciality}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Degree</h4>
                <p>{profile.degree}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Experience</h4>
                <p>{profile.experience} years</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Fees</h4>
                <p>₹{profile.fees}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">About</h4>
              <p className="mt-1">{profile.about}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Address</h4>
              <p className="mt-1">{profile.address?.line1}</p>
              <p>{profile.address?.line2}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorProfile
