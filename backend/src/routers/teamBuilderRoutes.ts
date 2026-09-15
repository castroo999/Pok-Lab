import { Router } from "express";

import { teamBuilder } from "../controllers/teamBuilderController.js";

const router = Router();

router.post("/team-builder", teamBuilder);

export default router;
