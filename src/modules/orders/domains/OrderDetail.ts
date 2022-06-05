import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { Menu } from "./Menu";

interface OrderProps {
  order: Order;
  quantity: number;
  note?: string;
  menu: Menu;
}

export class Order extends Entity<OrderProps> {
  private constructor(props: OrderProps, id?: string) {
    super(props, id);
  }

  public static create(props: OrderProps, id?: string): Result<Order> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.order, argumentName: "detail's order" },
      { argument: props.quantity, argumentName: "details quantity" },
      { argument: props.note, argumentName: "details node" },
      { argument: props.menu, argumentName: "details menu" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Order>(guardResult.succeeded);
    }

    const menu = new Order(props, id);
    return Result.ok<Order>(menu);
  }
}
