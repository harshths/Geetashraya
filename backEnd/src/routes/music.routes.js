import express from 'express';
import { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById} from '../controller/music.controller.js';
import multer from 'multer';
import {authArtist, authUser} from '../middlewares/auth.middleware.js';

const upload = multer({
    storage: multer.memoryStorage()
})

const router = express.Router();

router.post("/upload", authArtist,upload.fields([{name: "music", maxCount: 1}, {name: "thumbnail", maxCount: 1}]), createMusic);

router.post("/album", authArtist, createAlbum);

router.get("/",authUser, getAllMusics);

router.get("/album",authUser, getAllAlbums);

router.get("/album/:albumId",authUser, getAlbumById);

export default router;