import { Request, Response, Router } from "express";

import {
  getAllMenusController,
  getMenusController,
} from "../../../../modules/orders/controllers";
import { auth } from "../../middleware/auth";
import { verifyTableToken } from "../../middleware/verifyTableToken";

export const menuRouter = Router();

menuRouter.get("/all", auth("admin"), (req: Request, res: Response) => {
  return getAllMenusController.execute(req, res);
});

menuRouter.get("/list", verifyTableToken, (req: Request, res: Response) => {
  return getMenusController.execute(req, res);
});

// TODO: CRUD MENU
