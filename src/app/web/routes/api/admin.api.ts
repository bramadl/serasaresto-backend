import { Request, Response, Router } from "express";
import { loginController } from "../../../../modules/admin/controllers";

export const adminRouter = Router();

adminRouter.post("/login", (req: Request, res: Response) => {
  return loginController.execute(req, res);
});
