import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { TableToken } from "../../../customers/domains/valueObjects/TableToken";
import { ITableRepo } from "../../../customers/repositories/ITableRepo";
import { Cart } from "../../domains/Cart";
import { ICartRepo } from "../../repositories/ICartRepo";
import { IMenuRepo } from "../../repositories/IMenuRepo";

export class RemoveItemFromCartUseCase extends BaseController {
  private cartRepo: ICartRepo;
  private menuRepo: IMenuRepo;
  private tableRepo: ITableRepo;

  constructor(cartRepo: ICartRepo, menuRepo: IMenuRepo, tableRepo: ITableRepo) {
    super();
    this.cartRepo = cartRepo;
    this.menuRepo = menuRepo;
    this.tableRepo = tableRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Take the requests data.
      const tableTokenRequest = (req.headers.authorization as string).split(
        " "
      )[1];
      const { id: menuIdRequest } = req.params;

      // 2. Find the cart using table id
      const createTableToken = TableToken.create({ value: tableTokenRequest });
      const tableToken = createTableToken.getValue();
      const tableFromRepo = await this.tableRepo.findByTableToken(tableToken);
      if (tableFromRepo.isFailure) {
        return this.notFound(res, tableFromRepo.error);
      }
      const table = tableFromRepo.getValue();
      const cartRepo = await this.cartRepo.getCartByTableId(table.id);
      if (cartRepo.isFailure) return this.notFound(res, cartRepo.error);
      const cart = cartRepo.getValue();

      // 3. Determine if the quantity of the item intended to be removed is 1
      const cartItemMenu = cart.cartItems.find(
        (cartItem) => cartItem.menu.id === menuIdRequest
      );
      if (!cartItemMenu) return this.notFound(res, "Cart item can't be found");
      const menuQuantity = cartItemMenu.quantity;
      if (menuQuantity !== 1)
        return this.badRequest(
          res,
          "Can't remove item if the menu quantity is not 1, use update instead."
        );

      // 4. Remove the menu from cart.
      const cartItem = cart.cartItems.find(
        (cartItem) => cartItem.id === menuIdRequest
      );
      await this.cartRepo.removeCartItem(cart, menuIdRequest);

      return this.noContent(res);
    } catch (err) {
      console.log("[RemoveItemFromCartUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
