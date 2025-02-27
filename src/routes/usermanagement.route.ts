import express from "express";
import {
  insertUser,
  login,
  logout,
} from "../controllers/usermanagement.controller";
const router = express.Router();

router.post("/register", insertUser);
router.post("/login", login);
router.get("/logout", logout);

export const userRoute = router;