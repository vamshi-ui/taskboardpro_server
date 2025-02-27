import express from "express";
import {
  getUser,
  insertUser,
  login,
  logout,
} from "../controllers/usermanagement.controller";
import { authorize } from "../middlewares/auth";
const router = express.Router();

router.post("/auth/register", insertUser);
router.post("/auth/login", login);
router.get("/auth/userinfo", authorize(["admin", "user"]), getUser);
router.get("/auth/logout", logout);

export const userRoute = router;