import express from "express";
import {
  insertUser,
  login,
  logout,
  verifyEmail,
} from "../controllers/usermanagement.controller";
const router = express.Router();

router.post("/register", insertUser);
router.post("/login", login);
router.get("/logout", logout);

router.get("/verify-email/:token", verifyEmail);

export const userRoute = router;
