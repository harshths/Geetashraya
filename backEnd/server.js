import app from "./src/app.js";
import dotenv from 'dotenv';
import dbConnection from "./src/db/db.js";

dotenv.config();

const port = process.env.PORT;

dbConnection();

app.listen(port, () => {
    console.log("Server is runnning on port - ", port);
})

