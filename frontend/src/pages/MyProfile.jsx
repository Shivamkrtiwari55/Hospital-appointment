import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateUserProfileData = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      if (image) formData.append('image', image);

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Error updating profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setImage(null);
    loadUserProfileData(); // revert unsaved changes
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center py-10">
      <div className="w-full max-w-5xl flex gap-8">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 w-1/4 min-w-[220px]">
          <img
            className="w-28 h-28 rounded-full object-cover border-4 border-blue-200 mb-4"
            src={userData.image}
            alt="Profile"
          />
          <h2 className="text-xl font-bold text-blue-700">{userData.name}</h2>
          <p className="text-gray-500 mt-2">{userData.email}</p>
          <div className="mt-8">
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              onClick={() => setIsEdit(true)}
              disabled={isEdit}
            >
              Edit Profile
            </button>
          </div>
        </aside>

        {/* Main Card */}
        <main className="flex-1">
          <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="relative">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer group">
                    <img
                      className="w-32 h-32 rounded-full object-cover border-4 border-blue-300"
                      src={image ? URL.createObjectURL(image) : userData.image}
                      alt="Profile"
                    />
                    <div className="absolute bottom-2 right-2 bg-blue-600 p-2 rounded-full shadow-lg group-hover:bg-blue-700 transition">
                      <img className="w-6" src={assets.upload_icon} alt="Upload" />
                    </div>
                    <input
                      onChange={e => setImage(e.target.files[0])}
                      type="file"
                      id="image"
                      accept="image/*"
                      hidden
                    />
                  </label>
                ) : (
                  <img
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-300"
                    src={userData.image}
                    alt="Profile"
                  />
                )}
              </div>
              {isEdit ? (
                <input
                  className="mt-4 text-2xl font-bold text-center border-b-2 border-blue-200 focus:outline-none focus:border-blue-500 transition bg-blue-50 px-2 py-1"
                  type="text"
                  placeholder="Full Name"
                  value={userData.name}
                  onChange={e => setUserData(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <h1 className="mt-4 text-2xl font-bold text-blue-800">{userData.name}</h1>
              )}
              <p className="text-gray-500">{userData.email}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <section>
                <h3 className="text-blue-600 font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 font-medium">Phone</label>
                    {isEdit ? (
                      <input
                        className="w-full bg-blue-50 border-b-2 border-blue-200 focus:border-blue-500 px-2 py-1 transition"
                        type="text"
                        placeholder="Phone Number"
                        value={userData.phone}
                        onChange={e => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    ) : (
                      <div className="text-blue-700">{userData.phone}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium">Address</label>
                    {isEdit ? (
                      <div className="space-y-2">
                        <input
                          className="w-full bg-blue-50 border-b-2 border-blue-200 focus:border-blue-500 px-2 py-1 transition"
                          placeholder="Address Line 1"
                          onChange={e =>
                            setUserData(prev => ({
                              ...prev,
                              address: { ...prev.address, line1: e.target.value },
                            }))
                          }
                          value={userData.address?.line1 || ''}
                          type="text"
                        />
                        <input
                          className="w-full bg-blue-50 border-b-2 border-blue-200 focus:border-blue-500 px-2 py-1 transition"
                          placeholder="Address Line 2"
                          onChange={e =>
                            setUserData(prev => ({
                              ...prev,
                              address: { ...prev.address, line2: e.target.value },
                            }))
                          }
                          value={userData.address?.line2 || ''}
                          type="text"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-700">
                        {userData.address?.line1}
                        <br />
                        {userData.address?.line2}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Basic Info */}
              <section>
                <h3 className="text-blue-600 font-semibold mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-600 font-medium">Gender</label>
                    {isEdit ? (
                      <select
                        className="w-full bg-blue-50 border-b-2 border-blue-200 focus:border-blue-500 px-2 py-1 transition"
                        onChange={e => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                        value={userData.gender}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <div className="text-gray-700">{userData.gender}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-600 font-medium">Birthday</label>
                    {isEdit ? (
                      <input
                        className="w-full bg-blue-50 border-b-2 border-blue-200 focus:border-blue-500 px-2 py-1 transition"
                        type="date"
                        onChange={e => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                        value={userData.dob}
                      />
                    ) : (
                      <div className="text-gray-700">{userData.dob}</div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex justify-center gap-6">
              {isEdit ? (
                <>
                  <button
                    className="bg-blue-600 text-white px-8 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                    onClick={updateUserProfileData}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 px-8 py-2 rounded-full font-semibold hover:bg-gray-300 transition"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyProfile;
