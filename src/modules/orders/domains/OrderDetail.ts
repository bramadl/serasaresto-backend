import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { Menu } from "./Menu";
import { Order } from "./Order";

interface OrderDetailProps {
  order: Order;
  quantity: number;
  note?: string;
  menu: Menu;
}

export class OrderDetail extends Entity<OrderDetailProps> {
  private constructor(props: OrderDetailProps, id?: string) {
    super(props, id);
  }

  public static create(
    props: OrderDetailProps,
    id?: string
  ): Result<OrderDetail> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.order, argumentName: "detail's order" },
      { argument: props.quantity, argumentName: "details quantity" },
      { argument: props.note, argumentName: "details node" },
      { argument: props.menu, argumentName: "details menu" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<OrderDetail>(guardResult.succeeded);
    }

    const menu = new OrderDetail(props, id);
    return Result.ok<OrderDetail>(menu);
  }
}
