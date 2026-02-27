import cookieParser from 'cookie-parser';
import express from 'express';
import authRouter from './routes/auth.route.js';
import musicRouter from './routes/music.routes.js';
import profileRouter from './routes/profile.route.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth", authRouter);
app.use("/api/music", musicRouter);
app.use("/api/profile", profileRouter);


export default app;