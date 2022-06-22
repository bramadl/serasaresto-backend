import { Request, Response, Router } from "express";

import { getAllTableController } from "../../../../modules/customers/controllers";
import { auth } from "../../middleware/auth";

export const tableRouter = Router();

tableRouter.get("/all", auth("admin"), (req: Request, res: Response) => {
  return getAllTableController.execute(req, res);
});
