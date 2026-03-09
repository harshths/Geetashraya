import express from "express";
import {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
  getMusicById,
  updateMusic,
  deleteMusic,
  toggleLikeMusic,
  deleteAlbum,
  updateAlbumTitle,
  addMusicToAlbum,
  deleteMusicFromAlbum,
  increasePlayCount,
  getTrendingSongs
} from "../controller/music.controller.js";
import multer from "multer";
import { authArtist, authUser } from "../middlewares/auth.middleware.js";
import { uploadThumbnail } from "../services/storage.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/upload",
  authArtist,
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  createMusic,
);

router.post("/album", authArtist, upload.single("thumbnail"), createAlbum);

router.get("/", authUser, getAllMusics);

router.get("/album", authUser, getAllAlbums);

router.get("/trending",authUser, getTrendingSongs);


router.get("/album/:albumId", authUser, getAlbumById);

router.get("/:musicId", authUser, getMusicById);

router.put("/:musicId", authArtist, updateMusic);

router.put( "/play/:id", authUser, increasePlayCount);

router.delete("/:musicId", authArtist, deleteMusic);

router.post("/like/:musicId", authUser, toggleLikeMusic);

router.delete("/album/:albumId", authArtist, deleteAlbum);

router.put("/album/:albumId", authArtist, updateAlbumTitle);

router.post("/album/:albumId/music", authArtist, addMusicToAlbum);


router.delete(
  "/album/:albumId/music/:musicId",
  authArtist,
  deleteMusicFromAlbum,
);

export default router;
