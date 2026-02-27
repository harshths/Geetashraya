const MusicCard = ({ music }) => {
  return (
    <div className="bg-zinc-900 p-4 rounded-xl shadow-lg hover:scale-105 transition">
      <img
        src={music.thumbnail}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h2 className="text-lg font-semibold">{music.title}</h2>
      <p className="text-sm text-gray-400 mb-2">
        {music.artist?.username}
      </p>
      <audio controls className="w-full">
        <source src={music.uri} />
      </audio>
    </div>
  );
};

export default MusicCard;