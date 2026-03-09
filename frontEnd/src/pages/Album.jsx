import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import MusicCard from "../components/MusicCard";
import React from 'react';

function Album() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [songs, setSongs] = useState([]);

  const fetchAlbum = async () => {
    try {
      const res = await API.get(`/music/album/${id}`);
      setAlbum(res.data.album);
      setSongs(res.data.album.musics);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAlbum();
  }, [id]);

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
        <img 
          src={album.cover} 
          alt={album.name} 
          className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-lg shadow-xl"
        />
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {album.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {songs.length} {songs.length === 1 ? 'song' : 'songs'}
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Songs</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {songs.map((song) => (
          <MusicCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default Album;