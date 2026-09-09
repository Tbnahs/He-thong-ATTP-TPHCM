import { Router, type IRouter } from "express";
import healthRouter from "./health";
import attpRouter from "./attp";

const router: IRouter = Router();

router.use(healthRouter);
router.use(attpRouter);

export default router;
