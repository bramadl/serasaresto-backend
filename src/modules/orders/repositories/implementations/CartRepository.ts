import { Prisma } from "@prisma/client";
import { Result } from "../../../../shared/logic/Result";
import { Cart } from "../../domains/Cart";
import { CartMap } from "../../mappings/CartMap";
import { ICartRepo } from "../ICartRepo";

export class CartRepository implements ICartRepo {
  private cartPrisma: Prisma.CartDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  private cartItemPrisma: Prisma.CartItemDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  constructor(
    cartPrisma: Prisma.CartDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >,
    cartItemPrisma: Prisma.CartItemDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  ) {
    this.cartPrisma = cartPrisma;
    this.cartItemPrisma = cartItemPrisma;
  }

  private async recalculateCartTotal(cartId: string): Promise<void> {
    const cart = await this.cartPrisma.findFirst({
      where: { id: cartId },
      include: { cartItems: { include: { menu: true } } },
    });
    if (!cart) return;
    const total = cart.cartItems
      .map((cartItem) => cartItem.menu.price * cartItem.quantity)
      .reduce((prev, curr) => prev + curr, 0);
    await this.cartPrisma.update({
      where: { id: cartId },
      data: { total },
    });
  }

  private async exists(cartId: string): Promise<boolean> {
    return Boolean(await this.cartPrisma.findFirst({ where: { id: cartId } }));
  }

  public async getCartById(id: string): Promise<Result<Cart>> {
    const cart = await this.cartPrisma.findFirst({
      where: { id },
      include: { table: true, cartItems: { include: { menu: true } } },
    });
    if (!cart) return Result.fail<Cart>("Cart could not be found.");
    const cartDomain = CartMap.toDomain(cart);
    return Result.ok<Cart>(cartDomain);
  }

  public async getCartByTableId(tableId: string): Promise<Result<Cart>> {
    const cart = await this.cartPrisma.findFirst({
      where: { tableId },
      include: { table: true, cartItems: { include: { menu: true } } },
    });
    if (!cart) return Result.fail<Cart>("Cart could not be found.");
    const cartDomain = CartMap.toDomain(cart);
    return Result.ok<Cart>(cartDomain);
  }

  public async addCartItem(cart: Cart): Promise<Result<void>> {
    const isCartExists = await this.exists(cart.id);
    if (!isCartExists) throw new Error("Cart is not exists.");

    const oldCart = await this.getCartById(cart.id);
    const oldCartItem = oldCart.getValue().cartItems[0];
    const cartItem = cart.cartItems[0];

    if (oldCartItem && oldCartItem.menu.id === cartItem.menu.id) {
      return Result.fail<void>(
        "Menu has been created for this cart. Use update cart item to modify your menu inside your cart."
      );
    }

    await this.cartItemPrisma.create({
      data: {
        cartId: cart.id,
        menuId: cartItem.menu.id,
        quantity: cartItem.quantity,
        note: cartItem.note,
      },
    });

    await this.recalculateCartTotal(cart.id);
    return Result.ok<void>();
  }

  public async updateCartItem(
    cart: Cart,
    menuId: string,
    { quantity, note }: { quantity: number; note: string }
  ): Promise<Result<void>> {
    const isCartExists = await this.exists(cart.id);
    if (!isCartExists) throw new Error("Cart is not exists.");

    await this.cartItemPrisma.update({
      include: { cart: true, menu: true },
      where: { menuId },
      data: { quantity, note },
    });

    await this.recalculateCartTotal(cart.id);
    return Result.ok();
  }

  public async removeCartItem(
    cart: Cart,
    menuId: string
  ): Promise<Result<void>> {
    const isCartExists = await this.exists(cart.id);
    if (!isCartExists) throw new Error("Cart is not exists.");

    await this.cartItemPrisma.delete({
      include: { cart: true, menu: true },
      where: { menuId },
    });

    await this.recalculateCartTotal(cart.id);
    return Result.ok<void>();
  }

  public async clearCart(cart: Cart): Promise<Result<void>> {
    const isCartExists = await this.exists(cart.id);
    if (!isCartExists) throw new Error("Cart is not exists.");

    await this.cartItemPrisma.deleteMany({
      where: { cartId: cart.id },
    });
    await this.recalculateCartTotal(cart.id);
    return Result.ok<void>();
  }
}
