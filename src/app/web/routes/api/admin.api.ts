import { Request, Response, Router } from "express";
import {
  getDashboardStatsController,
  getProfileController,
  loginController,
} from "../../../../modules/admin/controllers";
import { auth } from "../../middleware/auth";

export const adminRouter = Router();

adminRouter.get("/profile", auth("admin"), (req: Request, res: Response) => {
  return getProfileController.execute(req, res);
});

adminRouter.post("/login", (req: Request, res: Response) => {
  return loginController.execute(req, res);
});

adminRouter.get("/dashboard/stats", (req: Request, res: Response) => {
  return getDashboardStatsController.execute(req, res);
});
