import { Link } from "react-router-dom";
import React from 'react';

function AlbumCard({ album }) {
  return (
    <Link to={`/album/${album._id}`} className="no-underline">
      <div className="w-[180px] bg-white dark:bg-neutral-900 p-3 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-neutral-800">
        <img 
          src={album.cover} 
          alt={album.name} 
          className="w-full aspect-square object-cover rounded-md"
        />
        <h4 className="text-gray-900 dark:text-white font-semibold mt-2 text-sm truncate">
          {album.name}
        </h4>
      </div>
    </Link>
  );
}

export default AlbumCard;