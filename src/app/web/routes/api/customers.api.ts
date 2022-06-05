import { Request, Response, Router } from "express";

import {
  getTableTokenController,
  reserveTableController,
} from "../../../../modules/customers/controllers";

export const customerRouter = Router();

customerRouter.post("/generate/table/token", (req: Request, res: Response) => {
  return getTableTokenController.execute(req, res);
});

customerRouter.post("/reserve/table", (req: Request, res: Response) => {
  return reserveTableController.execute(req, res);
});
