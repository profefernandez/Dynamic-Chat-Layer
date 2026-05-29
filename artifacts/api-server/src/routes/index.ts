import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import elementsRouter from "./elements";
import subElementsRouter from "./subelements";
import siteSettingsRouter from "./site-settings";
import contentRouter from "./content";
import storageRouter from "./storage";
import imagesRouter from "./images";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/chat", chatRouter);
router.use("/elements", elementsRouter);
router.use("/elements/:elementId/subelements", subElementsRouter);
router.use("/site-settings", siteSettingsRouter);
router.use("/content", contentRouter);
router.use("/images", imagesRouter);
router.use(storageRouter);

export default router;
