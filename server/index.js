import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactRoutes from "./routes/ContactRoutes.js"
import setUpSocket from "./socket.js"
import messagesRoute from "./routes/MessageRoutes.js"

dotenv.config();

const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;

const corsOptions = {
    origin: [process.env.ORIGIN],
    methods: ["GET, POST, PUT, PATCH, DELETE, HEAD"],
    credentials: true
}

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/messages', messagesRoute);

const server = app.listen(port, () => {
    console.log(`Server running at Port ${port}`);
})

setUpSocket(server);

mongoose.connect(databaseURL).then(() => console.log(`Database connected successfully !`)).catch((err) => console.log(err.message));
