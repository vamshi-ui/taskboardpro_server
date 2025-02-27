import dotenv from "dotenv";
dotenv.config();

import db from "./connection/dbconnection";
import app from "./app";

db.then(() => {
  console.log("Connected to the database");
  app.listen(process.env.PORT || 3000, () => {
    console.log("http://localhost:" + process.env.PORT);
  });
}).catch((err) => {
  console.log("Error connecting to the database", err);
  process.exit(1);
});
