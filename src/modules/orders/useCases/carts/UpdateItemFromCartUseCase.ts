import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { TableToken } from "../../../customers/domains/valueObjects/TableToken";
import { ITableRepo } from "../../../customers/repositories/ITableRepo";
import { ICartRepo } from "../../repositories/ICartRepo";
import { IMenuRepo } from "../../repositories/IMenuRepo";

export class UpdateItemFromCartUseCase extends BaseController {
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
      // 1. Take request data.
      const tableTokenRequest = (req.headers.authorization as string).split(
        " "
      )[1];
      const { id: menuIdRequest } = req.params;
      const { quantity: quantityRequest, note: noteRequest } = req.body;

      // 2. Validate request data.
      if (!quantityRequest && !noteRequest) {
        return this.badRequest(
          res,
          "Missing required params: {quantity, note}"
        );
      }

      if (quantityRequest === 0) {
        return this.badRequest(
          res,
          "Can not update quantity to 0, use delete endpoint instead."
        );
      }

      // 3. Find the corresponding cart.
      const createToken = TableToken.create({ value: tableTokenRequest });
      if (createToken.isFailure) return this.badRequest(res, createToken.error);
      const token = createToken.getValue();
      const tableRepo = await this.tableRepo.findByTableToken(token);
      if (tableRepo.isFailure) return this.badRequest(res, tableRepo.error);
      const table = tableRepo.getValue();
      const cartRepo = await this.cartRepo.getCartByTableId(table.id);
      if (cartRepo.isFailure) return this.notFound(res, cartRepo.error);
      const cart = cartRepo.getValue();

      // 4. Find the menu from cart.
      const menuRepo = await this.menuRepo.findMenuById(menuIdRequest);
      if (menuRepo.isFailure) return this.notFound(res, menuRepo.error);
      const menu = menuRepo.getValue();
      const menuItem = cart.cartItems.find((item) => item.menu.id === menu.id);
      if (!menuItem) return this.notFound(res, "Menu not found in this cart.");

      // 5. Update the menu from the cart.
      await this.cartRepo.updateCartItem(cart, menu.id, {
        quantity: quantityRequest,
        note: noteRequest,
      });

      // FINAL. Send response
      this.ok(res);
    } catch (err) {
      console.log("[UpdateItemFromCartUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
