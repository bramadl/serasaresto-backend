import { Request, Response, Router } from "express";

import {
  getTableTokenController,
  reserverTableUseCase,
} from "../../../../modules/customers/controllers";

export const customerRouter = Router();

customerRouter.post("/generate/table/token", (req: Request, res: Response) => {
  return getTableTokenController.execute(req, res);
});

customerRouter.post("/reserve/table", (req: Request, res: Response) => {
  return reserverTableUseCase.execute(req, res);
});
