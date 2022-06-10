import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { Table } from "../../customers/domains/Table";
import { CartItem } from "./CartItem";

interface CartProps {
  table: Table;
  total?: number;
  cartItems?: CartItem[];
}

export class Cart extends Entity<CartProps> {
  private constructor(props: CartProps, id?: string) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get table(): Table {
    return this.props.table;
  }

  get total(): number {
    return this.props.total as number;
  }

  get cartItems(): CartItem[] {
    return this.props.cartItems as CartItem[];
  }

  private recalculateTotal(): void {
    const total = this.cartItems
      .map((cartItem) => cartItem.menu.price * cartItem.quantity)
      .reduce((prev, curr) => prev + curr, 0);
    this.props.total = total;
  }

  public addItem(cartItem: CartItem) {
    const existingCartItem = this.cartItems.find((item) =>
      item.equals(cartItem)
    );
    if (existingCartItem) existingCartItem.addQuantity();
    else this.cartItems.push(cartItem);
    this.recalculateTotal();
  }

  public static create(props: CartProps, id?: string): Result<Cart> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.table, argumentName: "tables order" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Cart>(guardResult.succeeded);
    }

    const menu = new Cart(
      {
        table: props.table,
        cartItems: props.cartItems || [],
        total: props.total || 0,
      },
      id
    );
    return Result.ok<Cart>(menu);
  }
}
