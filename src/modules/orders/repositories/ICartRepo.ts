import { Result } from "../../../shared/logic/Result";
import { Cart } from "../domains/Cart";

export interface ICartRepo {
  getCartById(id: string): Promise<Result<Cart>>;
  getCartByTableId(tableId: string): Promise<Result<Cart>>;
  addCartItem(cart: Cart): Promise<Result<void>>;
  updateCartItems(cart: Cart, cartItemId: string): Promise<void>;
}
