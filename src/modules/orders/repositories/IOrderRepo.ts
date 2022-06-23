import { Result } from "../../../shared/logic/Result";
import { Order } from "../domains/Order";

export interface IOrderRepo {
  countOrders(): Promise<number>;
  listAll(): Promise<Order[]>;
  getAll(tableId: string, customerId: string): Promise<Result<Order[]>>;
  getById(id: string): Promise<Result<Order>>;
  getCustomerPendingOrders(customerId: string): Promise<Result<number>>;
  save(order: Order): Promise<Result<any>>;
  confirm(orderId: string): Promise<Result<void>>;
}
