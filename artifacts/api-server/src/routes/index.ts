import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import elementsRouter from "./elements";
import subElementsRouter from "./subelements";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/chat", chatRouter);
router.use("/elements", elementsRouter);
router.use("/elements/:elementId/subelements", subElementsRouter);

export default router;
