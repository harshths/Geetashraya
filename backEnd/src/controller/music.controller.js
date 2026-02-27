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

  const { title } = req.body;
  const musicFile = req.files["music"][0].buffer;
  const thumbnailFile = req.files["thumbnail"][0].buffer;

  const musicResult = await uploadMusic(musicFile);
  const thumbnailResult = await uploadThumbnail(thumbnailFile);

  const music = await musicModel.create({
    uri: musicResult.url,
    thumbnail: thumbnailResult.url,
    title,
    artist: req.user.id,
  });

  res.status(201).json({
    message: "Music created successfully..",
    music,
  });
};

const deleteMusic  = async (req, res) => {
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
}

const updateMusic = async (req, res) => {
  const { musicId } = req.params;
  const { title, thumbnail} = req.body;

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
  });
  
  res.status(200).json({
    message: "Music updated successfully..",
  })
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
}

const createAlbum = async (req, res) => {
  const { title, musics } = req.body;

  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musics,
  });

  res.status(201).json({
    message: "Album created successfully..",
    album,
  });
};

const getAllMusics = async (req, res) => {
  const musics = await musicModel.find().populate("artist");
  res.status(200).json({
    message: "Musics fetched successfully..",
    musics,
  });
}

const getAllAlbums = async (req, res) => {
  const albums = await albumModel.find().select("title artist ").populate("artist");
  res.status(200).json({
    message: "Albums fetched successfully..",
    albums,
  });
}

const getAlbumById = async (req, res) => {
  const { albumId } = req.params;
  
  const album = await albumModel.findById(albumId).populate("artist").populate("musics");
  res.status(200).json({
    message: "Album fetched successfully..",
    album,
  });
}

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
}

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
}

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

  album.musics.push(musicId);
  await album.save();

  res.status(200).json({
    message: "Music added to album successfully..",
    album,
  });
}

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

  album.musics = album.musics.filter(music => music.toString() !== musicId);
  await album.save();

  res.status(200).json({
    message: "Music removed from album successfully..",
    album,
  }); 
}



export { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById, deleteMusic , updateMusic, getMusicById, addMusicToAlbum, deleteAlbum, updateAlbumTitle, deleteMusicFromAlbum };