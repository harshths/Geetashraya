import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, getProfile } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("user in profile -> ", user.profilePic);

  const updatePic = async () => {
    if (!file) return;
    setLoading(true);
    const data = new FormData();
    data.append("profilepic", file);
    try {
      await axios.put("/profile/update", data);
      await getProfile();
      setFile(null);
    } catch (err) {
      console.error("Error updating profile pic:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-2xl">
      <img
        src={user.profilePic}
        className="w-32 h-32 rounded-full mx-auto object-cover"
        alt="profile"
      />
      <p className="text-center mt-4 text-xl">{user.username}</p>

      <input
        type="file"
        className="mt-4"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={loading}
      />

      <button
        onClick={updatePic}
        className={`mt-4 w-full py-2 rounded-lg ${
          loading ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
        }`}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Update Picture"}
      </button>
    </div>
  );
};

export default Profile;