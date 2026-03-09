import React, { useState, useEffect } from "react";
import API from "../api/axios";

function CreateAlbum() {
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);

  const fetchMySongs = async () => {
    try {
      const res = await API.get("/music/");
      setSongs(res.data.musics);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMySongs();
  }, []);

  const toggleSong = (id) => {
    if (selectedSongs.includes(id)) {
      setSelectedSongs(selectedSongs.filter((songId) => songId !== id));
    } else {
      setSelectedSongs([...selectedSongs, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("thumbnail", thumbnail);
    formData.append("musics", JSON.stringify(selectedSongs));

    try {
      await API.post("/music/album", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Album created successfully");
      setTitle("");
      setThumbnail(null);
      setSelectedSongs([]);
    } catch (error) {
      console.log(error);
      alert("Album creation failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Create Album
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Album Title
          </label>
          <input
            type="text"
            placeholder="Enter album title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Album Cover
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-black file:text-white dark:file:bg-white dark:file:text-black hover:file:bg-gray-800 dark:hover:file:bg-gray-200"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Select Songs
          </h3>
          
          {songs.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">No songs uploaded yet</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-neutral-800 rounded-md p-3">
              {songs.map((song) => (
                <label key={song._id} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song._id)}
                    onChange={() => toggleSong(song._id)}
                    className="w-4 h-4 text-black dark:text-white border-gray-300 dark:border-neutral-700 rounded focus:ring-black dark:focus:ring-white"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">{song.title}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-black dark:bg-white text-white dark:text-black rounded-md font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          Create Album
        </button>
      </form>
    </div>
  );
}

export default CreateAlbum;