import React, { useState, useEffect } from "react";
import { useMusicContext } from "../context/PlayerContext";

function MusicPlayer() {
  const { currentSong, isPlaying, togglePlay, audioRef } = useMusicContext();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const loaded = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", loaded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", loaded);
    };
  }, [currentSong, audioRef]);

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const time = e.target.value;

    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time) => {
    if (!time) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-800 px-6 py-3 shadow-lg">

      <div className="max-w-7xl mx-auto flex items-center gap-6">

        <div className="flex items-center gap-3 w-64 min-w-0">
          <div className="w-12 h-12 bg-gray-200 dark:bg-neutral-800 rounded overflow-hidden flex-shrink-0">
            {currentSong.thumbnail && (
              <img
                src={currentSong.thumbnail}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="truncate">
            <p className="text-gray-900 dark:text-white text-sm font-medium truncate">
              {currentSong.title}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
              {currentSong.artist?.username}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1/2">

          <span className="text-xs text-gray-500 w-10 text-right">
            {formatTime(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 cursor-pointer accent-black dark:accent-white"
          />

          <span className="text-xs text-gray-500 w-10">
            {formatTime(duration)}
          </span>

        </div>



        <div className="flex items-center">
          <button
            onClick={togglePlay}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

      </div>

      <audio ref={audioRef} src={currentSong.uri} autoPlay />
    </div>
  );
}

export default MusicPlayer;