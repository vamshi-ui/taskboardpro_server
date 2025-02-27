import mongoose from "mongoose";

const db = mongoose.connect(process.env.CONNECTION_URL || "");

export default db;
