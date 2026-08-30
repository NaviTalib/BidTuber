import { Router } from "express";
import { CATEGORIES } from "../constants.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ categories: CATEGORIES });
});

export default router;
