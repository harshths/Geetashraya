import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ArtistDashboard = () => {
  const { user } = useContext(AuthContext);

  // Music states
  const [title, setTitle] = useState("");
  const [musicFile, setMusicFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  // Album states
  const [albumTitle, setAlbumTitle] = useState("");
  const [selectedSongs, setSelectedSongs] = useState([]);

  const [myMusics, setMyMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingAlbum, setUploadingAlbum] = useState(false);

  // Fetch My Uploaded Songs
  const fetchMyMusics = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/music");

      const filtered = res.data.musics.filter(
        (m) => m.artist?._id === user._id
      );

      setMyMusics(filtered);
    } catch (err) {
      console.error("Error fetching musics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyMusics();
  }, [user]);

  // Upload Music
  const uploadMusic = async () => {
    if (!title || !musicFile || !thumbnail) {
      alert("Please fill all music details");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("music", musicFile);
    data.append("thumbnail", thumbnail);

    try {
      setUploading(true);
      await axios.post("/music/upload", data);

      setTitle("");
      setMusicFile(null);
      setThumbnail(null);

      await fetchMyMusics();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  // Handle Song Select
  const handleSongSelect = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(selectedSongs.filter((id) => id !== songId));
    } else {
      setSelectedSongs([...selectedSongs, songId]);
    }
  };

  // Create Album With Selected Songs
  const uploadAlbum = async () => {
    if (!albumTitle || selectedSongs.length === 0) {
      alert("Add album title and select at least one song");
      return;
    }

    try {
      setUploadingAlbum(true);

      await axios.post("/music/album", {
        title: albumTitle,
        songs: selectedSongs,
      });

      setAlbumTitle("");
      setSelectedSongs([]);

      alert("Album created successfully");
    } catch (err) {
      console.error("Album creation error:", err);
    } finally {
      setUploadingAlbum(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">🎵 Artist Dashboard</h2>

      {/* Artist Info */}
      <div className="bg-gray-900 p-6 rounded-2xl mb-8 flex items-center gap-6">
        <img
          src={user?.profilePic}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <p className="text-xl font-semibold">{user?.username}</p>
          <p className="text-gray-400 text-sm">
            Upload and manage your music & albums
          </p>
        </div>
      </div>

      {/* Upload Music */}
      <div className="bg-gray-900 p-6 rounded-2xl mb-10">
        <h3 className="text-xl font-semibold mb-4">Upload New Music</h3>

        <input
          type="text"
          placeholder="Music Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={uploading}
          className="w-full p-3 rounded-lg bg-gray-800 text-white mb-4"
        />

        <label className="block text-sm mb-1">
          Select Music File (.mp3, .wav)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setMusicFile(e.target.files[0])}
          disabled={uploading}
          className="mb-4"
        />

        <label className="block text-sm mb-1">
          Select Thumbnail (.jpg, .png)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          disabled={uploading}
          className="mb-4"
        />

        <button
          onClick={uploadMusic}
          disabled={uploading}
          className="w-full py-2 rounded-lg bg-indigo-500"
        >
          {uploading ? "Uploading..." : "Upload Music"}
        </button>
      </div>

      {/* Create Album */}
      <div className="bg-gray-900 p-6 rounded-2xl mb-10">
        <h3 className="text-xl font-semibold mb-4">Create Album</h3>

        <input
          type="text"
          placeholder="Album Title"
          value={albumTitle}
          onChange={(e) => setAlbumTitle(e.target.value)}
          disabled={uploadingAlbum}
          className="w-full p-3 rounded-lg bg-gray-800 text-white mb-4"
        />

        <h4 className="font-semibold mb-2">
          Select Songs To Add In Album
        </h4>

        {myMusics.length === 0 ? (
          <p>No uploaded songs yet.</p>
        ) : (
          <div className="mb-4 max-h-40 overflow-y-auto">
            {myMusics.map((song) => (
              <div key={song._id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedSongs.includes(song._id)}
                  onChange={() => handleSongSelect(song._id)}
                />
                <span>{song.title}</span>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={uploadAlbum}
          disabled={uploadingAlbum}
          className="w-full py-2 rounded-lg bg-green-500"
        >
          {uploadingAlbum ? "Creating..." : "Create Album"}
        </button>
      </div>

      {/* My Songs */}
      <h3 className="text-2xl font-semibold mb-4">My Uploaded Songs</h3>

      {loading ? (
        <p>Loading songs...</p>
      ) : myMusics.length === 0 ? (
        <p>No music uploaded yet.</p>
      ) : (
        <div>
          {myMusics.map((m) => (
            <div key={m._id} className="mb-2">
              {m.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;