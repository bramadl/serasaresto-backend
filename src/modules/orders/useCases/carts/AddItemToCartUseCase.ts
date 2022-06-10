import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { TableToken } from "../../../customers/domains/valueObjects/TableToken";
import { ITableRepo } from "../../../customers/repositories/ITableRepo";
import { Cart } from "../../domains/Cart";
import { CartItem } from "../../domains/CartItem";
import { ICartRepo } from "../../repositories/ICartRepo";
import { IMenuRepo } from "../../repositories/IMenuRepo";

export class AddItemToCartUseCase extends BaseController {
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
      // 1. Take request bodies.
      const headers = req.headers.authorization;
      if (!headers) {
        return res.status(401).json({
          message: "Unauthorized, please provide a valid table token.",
        });
      }

      const [bearer, token] = headers.split(" ");
      if (bearer !== "Bearer") {
        return res
          .status(401)
          .json({ message: "Unauthorized, please use a valid bearer type." });
      }

      const {
        menu_id: menuIdRequest,
        note: noteRequest,
        cart_id: cartIdRequest,
      } = req.body;

      const tableTokenRequest = token;

      console.log(menuIdRequest);

      // 2. Validate the request data.
      if (!menuIdRequest) {
        return this.badRequest(res, "Required parameters are missing.");
      }
      const createTableToken = TableToken.create({ value: tableTokenRequest });
      const tableToken = createTableToken.getValue();

      // 3. Get the table first.
      const tableFromRepo = await this.tableRepo.findByTableToken(tableToken);
      if (tableFromRepo.isFailure) {
        return this.notFound(res, tableFromRepo.error);
      }
      const table = tableFromRepo.getValue();

      // 4. Find the menu from repository.
      const menuFromRepo = await this.menuRepo.findMenuById(menuIdRequest);
      if (menuFromRepo.isFailure) {
        return this.notFound(res, menuFromRepo.error);
      }
      const menu = menuFromRepo.getValue();

      // 5. Find the cart for this table.
      const createCart = Cart.create({ table }, cartIdRequest);
      if (createCart.isFailure) return this.badRequest(res, createCart.error);
      const cart = createCart.getValue();

      // 6. Prepare a new cart item.
      const createCartItem = CartItem.create({
        menu,
        quantity: 1,
        note: noteRequest,
      });
      if (createCartItem.isFailure) {
        return this.badRequest(res, createCartItem.error);
      }
      const cartItem = createCartItem.getValue();

      // 7. Add cart item to cart domain.
      cart.addItem(cartItem);

      // 8. Persists cart items.
      const addingCartItemProcess = await this.cartRepo.addCartItem(cart);
      if (addingCartItemProcess.isFailure) {
        return this.conflict(res, addingCartItemProcess.error);
      }

      // FINAL. Send created response.
      return this.created(res, "Menu added to cart.");
    } catch (err) {
      console.log("[AddItemToCartUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
