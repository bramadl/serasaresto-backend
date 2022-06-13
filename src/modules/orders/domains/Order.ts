import { Status } from "@prisma/client";
import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { Customer } from "../../customers/domains/Customer";
import { Table } from "../../customers/domains/Table";
import { OrderDetail } from "./OrderDetail";

interface OrderProps {
  customer: Customer;
  table: Table;
  total: number;
  status: Status;
  number?: number;
  orderDetails: OrderDetail[];
  createdAt?: Date;
}

export class Order extends Entity<OrderProps> {
  private constructor(props: OrderProps, id?: string) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get customer(): Customer {
    return this.props.customer;
  }

  get number(): number {
    return this.props.number as number;
  }

  get table(): Table {
    return this.props.table;
  }

  get total(): number {
    return this.props.total;
  }

  get status(): Status {
    return this.props.status;
  }

  get orderDetails(): OrderDetail[] {
    return this.props.orderDetails;
  }

  get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  public static create(props: OrderProps, id?: string): Result<Order> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.customer, argumentName: "customers order" },
      { argument: props.table, argumentName: "tables order" },
      { argument: props.total, argumentName: "orders total" },
      { argument: props.status, argumentName: "orders status" },
      { argument: props.orderDetails, argumentName: "order details" },
    ]);

    if (!guardResult.succeeded) {
      return Result.fail<Order>(guardResult.succeeded);
    }

    const menu = new Order(props, id);
    return Result.ok<Order>(menu);
  }
}
