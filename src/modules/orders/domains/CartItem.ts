import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { Menu } from "./Menu";

interface CartItemProps {
  order: CartItem;
  quantity: number;
  note?: string;
  menu: Menu;
}

export class CartItem extends Entity<CartItemProps> {
  private constructor(props: CartItemProps, id?: string) {
    super(props, id);
  }

  public static create(props: CartItemProps, id?: string): Result<CartItem> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.order, argumentName: "detail's order" },
      { argument: props.quantity, argumentName: "details quantity" },
      { argument: props.note, argumentName: "details node" },
      { argument: props.menu, argumentName: "details menu" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<CartItem>(guardResult.succeeded);
    }

    const cartItem = new CartItem(props, id);
    return Result.ok<CartItem>(cartItem);
  }
}
