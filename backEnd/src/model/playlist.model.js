import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    musics: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "music"
        }
    ],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
}, {timestamps: true})