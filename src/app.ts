import express from "express";
import cors from "cors";
import cokkieparser from "cookie-parser";
import categoryRote from "./routes/category.route";
import tagsRoute from "./routes/tag.route";
import taskRoute from "./routes/task.route";
import { userRoute } from "./routes/usermanagement.route";
import path from 'path';
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(cokkieparser());
app.use("/api/category", categoryRote);
app.use("/api/tag", tagsRoute);
app.use("/api/task", taskRoute);
app.use("/api/auth", userRoute);

export default app;
