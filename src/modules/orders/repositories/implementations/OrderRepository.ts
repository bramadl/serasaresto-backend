import { Prisma } from "@prisma/client";
import { Result } from "../../../../shared/logic/Result";
import { Order } from "../../domains/Order";
import { OrderMap } from "../../mappings/OrderMap";
import { IOrderRepo } from "../IOrderRepo";

export class OrderRepository implements IOrderRepo {
  private prismaOrder: Prisma.OrderDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  constructor(
    prismaOrder: Prisma.OrderDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  ) {
    this.prismaOrder = prismaOrder;
  }

  private async exists(orderId: string): Promise<boolean> {
    const order = await this.prismaOrder.findFirst({ where: { id: orderId } });
    return Boolean(order);
  }

  private async count(): Promise<number> {
    return this.prismaOrder.count();
  }

  async countOrders(): Promise<number> {
    return this.count();
  }

  public async listAll(): Promise<Order[]> {
    const orders = await this.prismaOrder.findMany({
      include: {
        customer: true,
        orderDetails: {
          include: {
            menu: true,
          },
        },
        table: true,
      },
      orderBy: {
        status: "asc",
      },
    });

    return orders.map((order) => OrderMap.toDomain(order));
  }

  public async getAll(
    tableId: string,
    customerId: string
  ): Promise<Result<Order[]>> {
    const prismaOrders = await this.prismaOrder.findMany({
      where: {
        customerId,
        tableId,
      },
      include: {
        customer: true,
        orderDetails: {
          include: {
            menu: true,
            order: true,
          },
        },
        table: true,
      },
    });
    const ordersMap = prismaOrders.map((order) => OrderMap.toDomain(order));
    return Result.ok<Order[]>(ordersMap);
  }

  public async getById(id: string): Promise<Result<Order>> {
    const order = await this.prismaOrder.findUnique({
      where: { id },
      include: {
        customer: true,
        orderDetails: { include: { menu: true } },
        table: true,
      },
    });
    if (!order) return Result.fail<Order>("Order not found.");
    const orderMap = OrderMap.toDomain(order);
    return Result.ok<Order>(orderMap);
  }

  public async getCustomerPendingOrders(
    customerId: string
  ): Promise<Result<number>> {
    const orders = await this.prismaOrder.findMany({
      where: {
        customerId,
        status: "PENDING",
      },
    });

    return Result.ok<number>(orders.length);
  }

  public async confirm(orderId: string): Promise<Result<void>> {
    await this.prismaOrder.update({
      data: { status: "DONE" },
      where: { id: orderId },
    });
    return Result.ok<void>();
  }

  public async save(order: Order): Promise<Result<any>> {
    const isExists = await this.exists(order.id);
    if (isExists) throw new Error("Order already exists");
    const orderPersistence = OrderMap.toPersistent(order);
    const newOrder = await this.prismaOrder.create({
      data: {
        id: orderPersistence.id,
        number: (await this.count()) + 1,
        customerId: orderPersistence.customerId,
        tableId: orderPersistence.tableId,
        total: orderPersistence.total,
        status: orderPersistence.status,
        orderDetails: {
          createMany: {
            data: order.orderDetails.map((orderDetail) => ({
              menuId: orderDetail.menu.id,
              quantity: orderDetail.quantity,
              note: orderDetail.note,
            })),
            skipDuplicates: true,
          },
        },
      },
    });
    return Result.ok<any>(newOrder.id);
  }
}
