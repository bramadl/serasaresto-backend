import { Request, Response, Router } from "express";
import {
  addItemToCartController,
  getCartController,
  removeItemFromCartController,
  updateItemFromCartController,
} from "../../../../modules/orders/controllers";
import { verifyTableToken } from "../../middleware/verifyTableToken";

export const cartRouter = Router();

cartRouter.get("/", verifyTableToken, (req: Request, res: Response) => {
  return getCartController.execute(req, res);
});

cartRouter.post("/items", verifyTableToken, (req: Request, res: Response) => {
  return addItemToCartController.execute(req, res);
});

cartRouter.put(
  "/items/:id",
  verifyTableToken,
  (req: Request, res: Response) => {
    return updateItemFromCartController.execute(req, res);
  }
);

cartRouter.delete(
  "/items/:id",
  verifyTableToken,
  (req: Request, res: Response) => {
    return removeItemFromCartController.execute(req, res);
  }
);
