import mongoose from "mongoose";

const musicSchema = new mongoose.Schema(
  {
    uri: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    duration: {
      type: Number,
    },
    genre: {
      type: String,
      enum: ["pop", "rock", "sad", "lofi", "hiphop", "classical"],
    },
    playCount: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

const musicModel = mongoose.model("music", musicSchema);

export default musicModel;
