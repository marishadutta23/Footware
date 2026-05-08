import express from "express";
import { getLandingPage } from "./landController.js";

const router = express.Router();

router.get("/", getLandingPage);

export default router;
