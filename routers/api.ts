import { Router } from "express";

const router = Router();
import applicationRouter from "./application/index";

router.use("/applications", applicationRouter);

export default router;
