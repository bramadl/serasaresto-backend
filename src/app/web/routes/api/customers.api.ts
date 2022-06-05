import { Request, Response, Router } from "express";

import { getTableTokenController } from "../../../../modules/customers/controllers";

export const customerRouter = Router();

customerRouter.post("/generate/table/token", (req: Request, res: Response) => {
  return getTableTokenController.execute(req, res);
});
