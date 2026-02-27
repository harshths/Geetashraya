import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbConnection = async() => {
    try{
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Database connected successfully...");
    }
    catch(err){
        console.log("Error - ", err);
    }
}

export default dbConnection;