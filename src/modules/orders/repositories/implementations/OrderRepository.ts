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
