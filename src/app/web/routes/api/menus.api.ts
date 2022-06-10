import { Request, Response, Router } from "express";

import { getMenusController } from "../../../../modules/orders/controllers";

export const menuRouter = Router();

menuRouter.get("/list", (req: Request, res: Response) => {
  return getMenusController.execute(req, res);
});
