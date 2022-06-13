import { Request, Response, Router } from "express";
import {
  getOrderHistoriesController,
  makeOrderController,
  viewOrderController,
} from "../../../../modules/orders/controllers";
import { verifyTableToken } from "../../middleware/verifyTableToken";

export const orderRouter = Router();

orderRouter.get("/histories", verifyTableToken, (req: Request, res: Response) =>
  getOrderHistoriesController.execute(req, res)
);

orderRouter.get("/:id", verifyTableToken, (req: Request, res: Response) => {
  return viewOrderController.execute(req, res);
});

orderRouter.post("/", verifyTableToken, (req: Request, res: Response) => {
  return makeOrderController.execute(req, res);
});
