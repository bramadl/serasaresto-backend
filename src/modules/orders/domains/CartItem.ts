import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { Menu } from "./Menu";

interface CartItemProps {
  quantity: number;
  note: string | null;
  menu: Menu;
}

export class CartItem extends Entity<CartItemProps> {
  private constructor(props: CartItemProps, id?: string) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get quantity(): number {
    return this.props.quantity;
  }

  get note(): string {
    return this.props.note as string;
  }

  get menu(): Menu {
    return this.props.menu;
  }

  public addQuantity(): void {
    this.props.quantity = this.props.quantity + 1;
  }

  public static create(props: CartItemProps, id?: string): Result<CartItem> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.quantity, argumentName: "items quantity" },
      { argument: props.menu, argumentName: "items menu" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<CartItem>(guardResult.succeeded);
    }

    const cartItem = new CartItem(props, id);
    return Result.ok<CartItem>(cartItem);
  }
}
