import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";
dotenv.config();

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATEKEY,
});

const uploadMusic = async (file) => {
  const response = await client.files.upload({
    file: file.toString("base64"),
    fileName: "music.mp3"+Date.now(),
    folder: "backEnd/music",
  });

  return response;
};

const uploadThumbnail = async (file) => {
  const response = await client.files.upload({
    file: file.toString("base64"),
    fileName: "thumbnail_"+Date.now()+".jpg",
    folder: "backEnd/thumbnail",
  });

  return response;
}

const uploadProfilePic = async (file) => {
  const response = await client.files.upload({
    file: file.toString("base64"),
    fileName: "profilepic_"+Date.now()+".jpg",
    folder: "backEnd/profilepic",
  });

  return response;
}

export { uploadMusic, uploadThumbnail, uploadProfilePic };  

