import { Request, Response, Router } from "express";

import {
  getTenLatestCustomersController,
  getTableTokenController,
  logoutApplicationController,
  reserveTableController,
  getCustomersUseCase,
  removeCustomerUseCase,
} from "../../../../modules/customers/controllers";
import { auth } from "../../middleware/auth";

export const customerRouter = Router();

customerRouter.get(
  "/latest/10",
  auth("admin"),
  (req: Request, res: Response) => {
    return getTenLatestCustomersController.execute(req, res);
  }
);

customerRouter.get("/all", auth("admin"), (req: Request, res: Response) => {
  return getCustomersUseCase.execute(req, res);
});

customerRouter.delete("/:id", auth("admin"), (req: Request, res: Response) => {
  return removeCustomerUseCase.execute(req, res);
});

customerRouter.post("/generate/table/token", (req: Request, res: Response) => {
  return getTableTokenController.execute(req, res);
});

customerRouter.post("/reserve/table", (req: Request, res: Response) => {
  return reserveTableController.execute(req, res);
});

customerRouter.post("/logout/application", (req: Request, res: Response) => {
  return logoutApplicationController.execute(req, res);
});
