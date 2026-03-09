import musicModel from "../model/music.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { uploadMusic, uploadThumbnail } from "../services/storage.service.js";
import albumModel from "../model/album.model.js";

dotenv.config();

const createMusic = async (req, res) => {
  if (!req.files || !req.files["music"] || !req.files["thumbnail"]) {
    return res.status(400).json({
      message: "Music file and thumbnail are required..",
    });
  }

  const { title, genre, duration } = req.body;

  if (!title || !genre || !duration) {
    return res.status(400).json({
      message: "Title, genre, and duration are required..",
    });
  }

  const allowedGenres = ["pop", "rock", "sad", "lofi", "hiphop", "classical"];
  if (!allowedGenres.includes(genre)) {
    return res.status(400).json({
      message: `Genre must be one of the following: ${allowedGenres.join(", ")}..`,
    });
  }

  const musicFile = req.files["music"][0].buffer;
  const thumbnailFile = req.files["thumbnail"][0].buffer;

  const musicResult = await uploadMusic(musicFile);
  const thumbnailResult = await uploadThumbnail(thumbnailFile);

  const music = await musicModel.create({
    uri: musicResult.url,
    thumbnail: thumbnailResult.url,
    title,
    genre,
    duration,
    artist: req.user.id,
    likedBy: [],
  });

  res.status(201).json({
    message: "Music created successfully..",
    music,
  });
};

const deleteMusic = async (req, res) => {
  const { musicId } = req.params;

  const music = await musicModel.findById(musicId);
  if (!music) {
    return res.status(404).json({
      message: "Music not found..",
    });
  }

  if (music.artist.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to delete this music..",
    });
  }
  await musicModel.findByIdAndDelete(musicId);
  res.status(200).json({
    message: "Music deleted successfully..",
  });
};

const updateMusic = async (req, res) => {
  const { musicId } = req.params;
  const { title, thumbnail, duration, genre } = req.body;

  const music = await musicModel.findById(musicId);
  if (!music) {
    return res.status(404).json({
      message: "Music not found..",
    });
  }

  if (music.artist.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to update this music..",
    });
  }

  await musicModel.findByIdAndUpdate(musicId, {
    title: title,
    thumbnail: thumbnail,
    duration: duration,
    genre: genre,
  });

  res.status(200).json({
    message: "Music updated successfully..",
  });
};

const getMusicById = async (req, res) => {
  const { musicId } = req.params;

  const music = await musicModel.findById(musicId).populate("artist");
  if (!music) {
    return res.status(404).json({
      message: "Music not found..",
    });
  }

  res.status(200).json({
    message: "Music fetched successfully..",
    music,
  });
};

const createAlbum = async (req, res) => {
  try {

    const { title, musics } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Thumbnail is required",
      });
    }

    const thumbnailFile = req.file.buffer;

    const thumbnailResult = await uploadThumbnail(thumbnailFile);

    const newAlbum = await albumModel.create({
      title,
      thumbnail: thumbnailResult.url,
      artist: req.user.id,
      musics: musics ? JSON.parse(musics) : [],
    });

    res.status(201).json({
      message: "Album created successfully",
      album: newAlbum,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const getAllMusics = async (req, res) => {
  const musics = await musicModel.find().populate("artist");
  res.status(200).json({
    message: "Musics fetched successfully..",
    musics,
  });
};

const getTrendingSongs = async (req, res) => {
  try {

    const songs = await musicModel.find()
      .populate("artist", "username")
      .sort({ playCount: -1 })
      .limit(10);

    res.status(200).json(songs);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllAlbums = async (req, res) => {
  const albums = await albumModel
    .find()
    .select("title artist thumbnail")
    .populate("artist");
  res.status(200).json({
    message: "Albums fetched successfully..",
    albums,
  });
};

const getAlbumById = async (req, res) => {
  const { albumId } = req.params;

  const album = await albumModel
    .findById(albumId)
    .populate("artist")
    .populate("musics");

  if (!album) {
    return res.status(404).json({
      message: "Album not found..",
    });
  }

  res.status(200).json({
    message: "Album fetched successfully..",
    album,
  });
};

const deleteAlbum = async (req, res) => {
  const { albumId } = req.params;

  const album = await albumModel.findById(albumId);
  if (!album) {
    return res.status(404).json({
      message: "Album not found..",
    });
  }

  if (album.artist.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to delete this album..",
    });
  }

  await albumModel.findByIdAndDelete(albumId);
  res.status(200).json({
    message: "Album deleted successfully..",
  });
};

const updateAlbumTitle = async (req, res) => {
  const { albumId } = req.params;
  const { title } = req.body;

  const album = await albumModel.findById(albumId);
  if (!album) {
    return res.status(404).json({
      message: "Album not found..",
    });
  }

  if (album.artist.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to update this album..",
    });
  }

  album.title = title;
  await album.save();

  res.status(200).json({
    message: "Album title updated successfully..",
    album,
  });
};

const addMusicToAlbum = async (req, res) => {
  const { albumId } = req.params;
  const { musicId } = req.body;

  const album = await albumModel.findById(albumId);

  if (!album) {
    return res.status(404).json({
      message: "Album not found..",
    });
  }

  if (album.artist.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to update this album..",
    });
  }

  if (album.musics.includes(musicId)) {
    return res.status(400).json({
      message: "Music already exists in album..",
    });
  }

  album.musics.push(musicId);
  await album.save();

  res.status(200).json({
    message: "Music added to album successfully..",
    album,
  });
};

const deleteMusicFromAlbum = async (req, res) => {
  const { albumId, musicId } = req.params;

  const album = await albumModel.findById(albumId);

  if (!album) {
    return res.status(404).json({
      message: "Album not found..",
    });
  }

  if (album.artist.toString() !== req.user.id) {
    return res.status(403).json({
      message: "You are not authorized to update this album..",
    });
  }

  album.musics = album.musics.filter((music) => music.toString() !== musicId);
  await album.save();

  res.status(200).json({
    message: "Music removed from album successfully..",
    album,
  });
};

const toggleLikeMusic = async (req, res) => {
  const { musicId } = req.params;

  const music = await musicModel.findById(musicId);

  if (!music) {
    return res.status(404).json({
      message: "Music not found..",
    });
  }

  const userId = req.user.id;

  const isLiked = music.likedBy.includes(userId);

  if (isLiked) {
    music.likedBy = music.likedBy.filter((id) => id.toString() !== userId);
  } else {
    music.likedBy.push(userId);
  }

  await music.save();

  res.status(200).json({
    message: isLiked ? "Music unliked" : "Music liked",
    totalLikes: music.likedBy.length,
  });
};

const increasePlayCount = async (req, res) => {

  try {

    const song = await musicModel.findByIdAndUpdate(
      req.params.id,
      { $inc: { playCount: 1 } },
      { new: true }
    );

    res.json(song);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

export {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
  deleteMusic,
  updateMusic,
  getMusicById,
  addMusicToAlbum,
  deleteAlbum,
  updateAlbumTitle,
  deleteMusicFromAlbum,
  toggleLikeMusic,
  increasePlayCount,
  getTrendingSongs
};
