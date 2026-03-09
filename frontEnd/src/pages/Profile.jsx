import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/profile/get");
      setProfile(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  const updateProfile = async (e) => {
    e.preventDefault();

    const file = e.target.profilePic.files[0];
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await API.put("/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Profile picture updated");
      fetchProfile();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Profile
      </h2>

      <div className="bg-white dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={profile.profilePic}
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-neutral-800 mb-4"
          />
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {profile.username}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Role: {profile.role}
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Change Profile Picture
          </h3>

          <form onSubmit={updateProfile} className="space-y-4">
            <input
              name="profilePic"
              type="file"
              accept="image/*"
              className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white dark:file:bg-white dark:file:text-black hover:file:bg-gray-800 dark:hover:file:bg-gray-200"
            />
            
            <button
              type="submit"
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Update Picture
            </button>
          </form>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-800 pt-6 mt-6">
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;