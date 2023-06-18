import { Router } from "express";
import applicationRouter from "./application/index";
import llmRouter from "./llm/index";
import userRouter from "./users/index";

const router = Router();

router.use("/applications", applicationRouter);
router.use("/llms", llmRouter);
router.use("/users", userRouter);

export default router;
