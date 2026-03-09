import React, { createContext, useContext, useRef, useState } from "react";

const PlayerContext = createContext();

const useMusicContext = () => {
  return useContext(PlayerContext);
};

const PlayerContextProvider = ({ children }) => {

  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  const playSong = (song) => {

    if (currentSong?._id === song._id) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {

    if (!currentSong) return;

    if (isPlaying) {
      pauseSong();
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const globalState = {
    currentSong,
    isPlaying,
    playSong,
    pauseSong,
    togglePlay,
    audioRef,
  };

  return (
    <PlayerContext.Provider value={globalState}>
      {children}
    </PlayerContext.Provider>
  );
};

export { PlayerContextProvider, useMusicContext };