import { Request, Response, Router } from "express";
import {
  addItemToCartController,
  getCartUseCase,
} from "../../../../modules/orders/controllers";

export const cartRouter = Router();

cartRouter.get("/", (req: Request, res: Response) => {
  return getCartUseCase.execute(req, res);
});

cartRouter.post("/item", (req: Request, res: Response) => {
  return addItemToCartController.execute(req, res);
});
