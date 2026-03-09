import { useEffect, useState } from "react";
import API from "../api/axios";
import MusicCard from "../components/MusicCard";
import React from "react";

function Home() {
  const [songs, setSongs] = useState([]);
  const [trendingSongs, setTrendingSongs] = useState([]);

  const fetchSongs = async () => {
    try {
      const res = await API.get("/music");
      setSongs(res.data.musics);

      const trendingRes = await API.get("/music/trending");
      setTrendingSongs(trendingRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        All Songs
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-12">
        {songs.map((song) => (
          <MusicCard key={song._id} song={song} />
        ))}
      </div>

      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Trending Songs
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {trendingSongs.map((song) => (
          <MusicCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default Home;