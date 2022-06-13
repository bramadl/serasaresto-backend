import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { Menu } from "./Menu";

interface OrderDetailProps {
  quantity: number;
  note?: string;
  menu: Menu;
}

export class OrderDetail extends Entity<OrderDetailProps> {
  private constructor(props: OrderDetailProps, id?: string) {
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

  public static create(
    props: OrderDetailProps,
    id?: string
  ): Result<OrderDetail> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
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
