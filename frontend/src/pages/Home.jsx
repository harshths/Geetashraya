import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchMusics = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/music");
      setMusics(res.data.musics);
    } catch (err) {
      console.error("Error fetching musics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMusics();
  }, []);

  // Filter musics based on search input
  const filteredMusics = musics.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-semibold mb-6 mt-6">All Musics</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search songs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {loading ? (
        <p className="text-center text-gray-400 mt-10">Loading musics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMusics.length > 0 ? (
            filteredMusics.map((m) => (
              <div
                key={m._id}
                className="bg-gray-900 p-4 rounded-2xl shadow-lg hover:scale-105 transition transform"
              >
                <img
                  src={m.thumbnail}
                  className="rounded-xl h-40 w-full object-cover"
                  alt={m.title}
                />
                <p className="mt-3 font-medium">{m.title}</p>
                <p className="text-gray-400 text-sm">{m.artist?.username}</p>
                <audio controls className="w-full mt-2" src={m.uri}></audio>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-full mt-10">
              No songs found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;