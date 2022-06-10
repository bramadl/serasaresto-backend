import { Request, Response, Router } from "express";

import { getMenusController } from "../../../../modules/orders/controllers";
import { verifyTableToken } from "../../middleware/verifyTableToken";

export const menuRouter = Router();

menuRouter.get("/list", verifyTableToken, (req: Request, res: Response) => {
  return getMenusController.execute(req, res);
});
