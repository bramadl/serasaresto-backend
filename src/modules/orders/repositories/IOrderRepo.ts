import { Result } from "../../../shared/logic/Result";
import { Order } from "../domains/Order";

export interface IOrderRepo {
  getById(id: string): Promise<Result<Order>>;
  save(order: Order): Promise<Result<any>>;
}
