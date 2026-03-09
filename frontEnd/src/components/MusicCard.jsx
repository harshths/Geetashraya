import { useMusicContext } from "../context/PlayerContext";
import React from "react";
import API from "../api/axios.js";

function MusicCard({ song }) {
  const { playSong, currentSong, isPlaying, togglePlay } = useMusicContext();

  const handlePlay = async () => {
    if (currentSong?._id === song._id) {
      togglePlay();
    } else {
      playSong(song);
      try {
        await API.put(`/music/play/${song._id}`);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="w-[180px] bg-white dark:bg-neutral-900 p-3 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-200 dark:border-neutral-800 group">

      <div className="relative">
        <img
          src={song.thumbnail}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
        />

        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition"
        >
          {currentSong?._id === song._id && isPlaying ? "Pause" : "Play"}
        </button>
      </div>

      <h4 className="text-gray-900 dark:text-white font-semibold mt-2 text-sm truncate">
        {song.title}
      </h4>

      <p className="text-gray-600 dark:text-gray-400 text-xs truncate">
        {song.artist?.username}
      </p>
    </div>
  );
}

export default MusicCard;