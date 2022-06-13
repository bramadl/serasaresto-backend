import {
  Status,
  Customer as PrismaCustomer,
  Menu as PrismaMenu,
  Order as PrismaOrder,
  OrderDetail as PrismaOrderDetail,
  Table as PrismaTable,
} from "@prisma/client";
import { Customer } from "../../customers/domains/Customer";
import { Table } from "../../customers/domains/Table";
import { CustomerName } from "../../customers/domains/valueObjects/CustomerName";
import { CustomerToken } from "../../customers/domains/valueObjects/CustomerToken";
import { TableNumber } from "../../customers/domains/valueObjects/TableNumber";
import { TableToken } from "../../customers/domains/valueObjects/TableToken";
import { Menu } from "../domains/Menu";
import { Order } from "../domains/Order";
import { OrderDetail } from "../domains/OrderDetail";

export type OrderPersistence = {
  id: string;
  customerId: string;
  status: Status;
  tableId: string;
  total: number;
};

export class OrderMap {
  public static toDTO(order: Order): any {
    return {
      id: order.id,
      status: order.status,
      details: order.orderDetails.map((orderDetail) => ({
        menu: {
          id: orderDetail.menu.id,
          name: orderDetail.menu.name,
          price: orderDetail.menu.price,
          thumbnail: orderDetail.menu.thumbnail,
        },
        quantity: orderDetail.quantity,
        note: orderDetail.note,
      })),
      total: order.total,
      number: order.number,
    };
  }

  public static toDomain(
    order: PrismaOrder & {
      customer: PrismaCustomer;
      table: PrismaTable;
      orderDetails: (PrismaOrderDetail & {
        menu: PrismaMenu;
      })[];
    }
  ): Order {
    const createCustomer = Customer.create(
      {
        name: CustomerName.create(order.customer.name).getValue(),
        token: CustomerToken.create(order.customer.token as string).getValue(),
      },
      order.customer.id
    ).getValue();

    const createOrderDetails = order.orderDetails.map((orderDetail) =>
      OrderDetail.create(
        {
          menu: Menu.create(
            {
              description: orderDetail.menu.description,
              inStock: orderDetail.menu.inStock,
              name: orderDetail.menu.name,
              price: orderDetail.menu.price,
              type: orderDetail.menu.type,
              thumbnail: orderDetail.menu.thumbnail,
            },
            orderDetail.id
          ).getValue(),
          quantity: orderDetail.quantity,
          note: orderDetail.note as string,
        },
        orderDetail.id
      ).getValue()
    );

    const createTable = Table.create(
      {
        isReserved: order.table.isReserved,
        number: TableNumber.create(order.table.number).getValue(),
        token: TableToken.create({
          value: order.table.token as string,
        }).getValue(),
      },
      order.table.id
    ).getValue();

    const createOrder = Order.create({
      customer: createCustomer,
      orderDetails: createOrderDetails,
      status: order.status,
      table: createTable,
      total: order.total,
      number: order.number,
    });

    return createOrder.getValue();
  }

  public static toPersistent(order: Order): OrderPersistence {
    return {
      id: order.id,
      customerId: order.customer.id,
      status: order.status,
      tableId: order.table.id,
      total: order.total,
    };
  }
}
