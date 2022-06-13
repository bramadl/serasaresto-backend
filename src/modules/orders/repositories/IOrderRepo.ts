import { Result } from "../../../shared/logic/Result";
import { Order } from "../domains/Order";

export interface IOrderRepo {
  getAll(tableId: string, customerId: string): Promise<Result<Order[]>>;
  getById(id: string): Promise<Result<Order>>;
  save(order: Order): Promise<Result<any>>;
  confirm(orderId: string): Promise<Result<void>>;
}
