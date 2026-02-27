import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    axios.get("/music/album").then((res) => setAlbums(res.data.albums));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Albums</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {albums.map((a) => (
          <Link
            key={a._id}
            to={`/albums/${a._id}`}
            className="bg-gray-900 p-6 rounded-2xl hover:bg-gray-800 transition"
          >
            <p className="text-xl font-medium">{a.title}</p>
            <p className="text-gray-400 text-sm">{a.artist?.username}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Albums;