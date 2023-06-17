import { Router } from "express";
import applicationRouter from "./application/index";
import llmRouter from "./llm/index";

const router = Router();

router.use("/applications", applicationRouter);
router.use("/llms", llmRouter);

export default router;
