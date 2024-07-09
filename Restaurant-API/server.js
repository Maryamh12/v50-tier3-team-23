import express from "express";
import { connectToDb } from "./utils/db.js";
import logger from "./middleware/logger.js";
import router from "./router.js";
import fallthroughHandler from "./middleware/fallthroughHandler.js";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(logger);
app.use(router);
app.use(errorHandler);
app.use(fallthroughHandler);


const startServer = async () => {
  await connectToDb();
  console.log("Database connected");
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};

startServer();
