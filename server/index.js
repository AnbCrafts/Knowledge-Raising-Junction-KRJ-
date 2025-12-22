import express from 'express';
import dotenv, { configDotenv } from 'dotenv';
import cors from 'cors';



configDotenv();
// connectDB();

const app = express();
const port = process.env.PORT || 9000;





app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cors());




app.get('/', (req, res) => {
    res.send("Server Started Successfully, you are in the homepage...");
});

app.listen(port, () => {
    console.log(`Server running on port: http://localhost:${port}`);
});