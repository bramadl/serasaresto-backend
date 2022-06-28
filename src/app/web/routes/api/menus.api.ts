import { Request, Response, Router } from "express";

import {
  deleteMenuController,
  getAllMenusController,
  getMenusController,
  saveMenuController,
} from "../../../../modules/orders/controllers";
import { auth } from "../../middleware/auth";
import { upload } from "../../middleware/multer";
import { verifyTableToken } from "../../middleware/verifyTableToken";

export const menuRouter = Router();

menuRouter.get("/all", auth("admin"), (req: Request, res: Response) => {
  return getAllMenusController.execute(req, res);
});

menuRouter.get("/list", verifyTableToken, (req: Request, res: Response) => {
  return getMenusController.execute(req, res);
});

// TODO: CRUD MENU
menuRouter.post(
  "/",
  auth("admin"),
  upload.single("thumbnail"),
  (req: Request, res: Response) => {
    return saveMenuController.execute(req, res);
  }
);

menuRouter.patch(
  "/:id",
  auth("admin"),
  upload.single("thumbnail"),
  (req: Request, res: Response) => {
    return saveMenuController.execute(req, res);
  }
);

menuRouter.delete("/:id", auth("admin"), (req: Request, res: Response) => {
  return deleteMenuController.execute(req, res);
});
