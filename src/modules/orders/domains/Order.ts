import { OrderDetail } from "@prisma/client";
import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { Customer } from "../../customers/domains/Customer";
import { Table } from "../../customers/domains/Table";

interface OrderProps {
  customer: Customer;
  table: Table;
  total: number;
  status: "PENDING" | "DONE";
  orderDetails: OrderDetail[];
}

export class Order extends Entity<OrderProps> {
  private constructor(props: OrderProps, id?: string) {
    super(props, id);
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
