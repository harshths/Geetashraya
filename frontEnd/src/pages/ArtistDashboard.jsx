import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import MusicCard from "../components/MusicCard";
import React from "react";

function ArtistDashboard() {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  let id = null;

  const fetchArtistData = async () => {
    try {
      const songsRes = await API.get("/music/");
      const albumsRes = await API.get("/music/album");

      setSongs(songsRes.data.musics);
      setAlbums(albumsRes.data.albums);
      id = albumsRes.data.albums[0]?._id;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchArtistData();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Artist Dashboard
      </h2>

      <div className="flex gap-3 mb-8">
        <Link to="/upload-music">
          <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Upload Music
          </button>
        </Link>
        <Link to="/create-album">
          <button className="px-4 py-2 border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
            Create Album
          </button>
        </Link>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Your Albums
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        {albums.map((album) => (
          <Link
            key={album._id}
            to={`/album/${album._id}`}
            className="no-underline group"
          >
            <div className="text-center">
              <div className="aspect-square rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                <img
                  src={album.thumbnail}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-2 text-sm text-gray-900 dark:text-white font-medium truncate">
                {album.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Your Songs
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {songs.map((song) => (
          <MusicCard key={song._id} song={song} />
        ))}
      </div>
    </div>
  );
}

export default ArtistDashboard;