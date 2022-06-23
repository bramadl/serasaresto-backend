import { Request, Response, Router } from "express";
import {
  confirmOrderController,
  getAllOrdersController,
  getOrderHistoriesController,
  makeOrderController,
  viewOrderController,
} from "../../../../modules/orders/controllers";
import { auth } from "../../middleware/auth";
import { verifyTableToken } from "../../middleware/verifyTableToken";

export const orderRouter = Router();

orderRouter.get("/histories", verifyTableToken, (req: Request, res: Response) =>
  getOrderHistoriesController.execute(req, res)
);

orderRouter.get("/:id", verifyTableToken, (req: Request, res: Response) => {
  return viewOrderController.execute(req, res);
});

orderRouter.post(
  "/:id/confirm",
  verifyTableToken,
  (req: Request, res: Response) => confirmOrderController.execute(req, res)
);

orderRouter.post("/", verifyTableToken, (req: Request, res: Response) => {
  return makeOrderController.execute(req, res);
});

orderRouter.get("/all/orders", auth("admin"), (req: Request, res: Response) => {
  return getAllOrdersController.execute(req, res);
});
