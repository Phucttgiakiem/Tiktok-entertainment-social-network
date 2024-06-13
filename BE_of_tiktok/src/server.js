import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';
import cors from 'cors';
import { createServer } from 'http';
import { initSocket } from './socket';
require('dotenv').config();

let app = express();

app.use(cors());
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))



viewEngine(app);


connectDB();

let port = process.env.PORT;

// Tạo một HTTP server từ ứng dụng Express
const httpServer = createServer(app);
const io = new initSocket(httpServer);


initWebRoutes(app);

// Bắt đầu HTTP server
httpServer.listen(port, () => {
    console.log('Backend Nodejs is running on the port: ' + port);
});

// app.listen(port,() => {
//     console.log("backend Nodejs is runing on the port: "+port)
// })
