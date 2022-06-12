import { Request, Response, Router } from "express";
import {
  addItemToCartController,
  getCartUseCase,
  removeItemFromCartController,
} from "../../../../modules/orders/controllers";
import { verifyTableToken } from "../../middleware/verifyTableToken";

export const cartRouter = Router();

cartRouter.get("/", (req: Request, res: Response) => {
  return getCartUseCase.execute(req, res);
});

cartRouter.post("/items", verifyTableToken, (req: Request, res: Response) => {
  return addItemToCartController.execute(req, res);
});

cartRouter.delete(
  "/items/:id",
  verifyTableToken,
  (req: Request, res: Response) => {
    return removeItemFromCartController.execute(req, res);
  }
);
