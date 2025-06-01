import express from "express";
import { userLogin, userSignup } from "../controllers/controller.js";

const router = express.Router();
router.get("/login", userLogin);
router.get("/signup", userSignup);
export default router;
