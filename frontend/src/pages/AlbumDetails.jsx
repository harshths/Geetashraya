import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    axios.get(`/music/album/${id}`).then((res) => setAlbum(res.data.album));
  }, [id]);

  if (!album) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">{album.title}</h2>
      <div className="space-y-4">
        {album.musics.map((m) => (
          <div key={m._id} className="bg-gray-900 p-4 rounded-xl">
            <p>{m.title}</p>
            <audio controls className="w-full mt-2" src={m.uri}></audio>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AlbumDetails;