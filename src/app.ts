import express from "express";
import cors from "cors";
import categoryRote from "./routes/category.route";
import tagsRoute from "./routes/tag.route";
import taskRoute from "./routes/task.route";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/category", categoryRote);
app.use("/api/tag", tagsRoute);
app.use("/api/task", taskRoute);

export default app;
