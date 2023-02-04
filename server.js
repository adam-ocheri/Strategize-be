import express from 'express';
import ProjectRouter from './routes/projectsRoute.js';
import UserRouter from './routes/userRoute.js';
import { errorHandler } from './middleware/errorHandler.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
//import mongodb from 'mongodb';
//fix Node's "path" to support ESModules instead of CJS.
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
//setup
dotenv.config();
connectDB();
const PORT = process.env.PORT || 4000;
const app = express();
//! exclude frontend/ from git ignore, and push to 2 separate repositories, with the folder directory to have the BE and FE resource available locally ("./")
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/projects", ProjectRouter);
app.use("/api/user", UserRouter);
app.use(errorHandler);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    if (req.method === 'OPTIONS')
        res.sendStatus(200);
    else
        next();
});
//Serve Frontend
// if (process.env.NODE_ENV === 'production')
// {
//     app.use(express.static(path.join(__dirname, '../frontend/strategize/build')));
//     app.get('*', (req, res) => {
//         res.sendFile(
//             path.resolve(__dirname, '../', 'frontend', 'strategize', 'build', 'index.html')
//         );
//     });
// }
// else{
//     app.get('/', (req,res) => {
//         res.send('Please set to production environment')
//     })
// }
//Start server
// const client = new mongodb.MongoClient (process.env.MONGO_URI);
// const dbName = 'strategizedb';
// client.connect().then(() => {
//       global.db = client.db(dbName);
// })
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
