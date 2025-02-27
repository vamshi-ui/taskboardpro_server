import express from "express";
import {
  getUser,
  insertUser,
  login,
  logout,
} from "../controllers/usermanagement.controller";
import { authorize } from "../middlewares/auth";
const router = express.Router();

router.post("/register", insertUser);
router.post("/login", login);
router.get("/userinfo", authorize(["admin", "user"]), getUser);
router.get("/logout", logout);

export const userRoute = router;