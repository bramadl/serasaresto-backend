import { Status } from "@prisma/client";
import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { TableToken } from "../../../customers/domains/valueObjects/TableToken";
import { ICustomerRepo } from "../../../customers/repositories/ICustomerRepo";
import { ITableRepo } from "../../../customers/repositories/ITableRepo";
import { Order } from "../../domains/Order";
import { OrderDetail } from "../../domains/OrderDetail";
import { ICartRepo } from "../../repositories/ICartRepo";
import { IOrderRepo } from "../../repositories/IOrderRepo";

export class MakeOrderUseCase extends BaseController {
  private cartRepo: ICartRepo;
  private customerRepo: ICustomerRepo;
  private tableRepo: ITableRepo;
  private orderRepo: IOrderRepo;

  constructor(
    cartRepo: ICartRepo,
    customerRepo: ICustomerRepo,
    tableRepo: ITableRepo,
    orderRepo: IOrderRepo
  ) {
    super();
    this.cartRepo = cartRepo;
    this.customerRepo = customerRepo;
    this.tableRepo = tableRepo;
    this.orderRepo = orderRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Take table token.
      const tableTokenRequest = (req.headers.authorization as string).split(
        " "
      )[1];

      // 2. Find the cart based on the table id.
      const createToken = TableToken.create({ value: tableTokenRequest });
      if (createToken.isFailure) return this.badRequest(res, createToken.error);
      const token = createToken.getValue();
      const tableRepo = await this.tableRepo.findByTableToken(token);
      if (tableRepo.isFailure) return this.notFound(res, tableRepo.error);
      const table = tableRepo.getValue();
      const cartRepo = await this.cartRepo.getCartByTableId(table.id);
      if (cartRepo.isFailure) return this.notFound(res, cartRepo.error);
      const cart = cartRepo.getValue();

      // 3. We need to take customer, table, total, and the cart items' menus
      const customer = await this.customerRepo.findByTable(table);
      if (!customer) return this.notFound(res, "Customer not found.");
      const total = cart.total;
      const cartItems = cart.cartItems;

      // 4. If the cart items are empty, abort the service.
      if (!cartItems.length) {
        return this.unprocessableEntity(res, "Cart does not have any menu.");
      }

      // 5. Make an order detail
      const createOrderDetails = cartItems.map((cartItem) => {
        return OrderDetail.create(
          {
            quantity: cartItem.quantity,
            note: cartItem.note,
            menu: cartItem.menu,
          },
          cartItem.id
        );
      });
      const failed = createOrderDetails.find((detail) => detail.isFailure);
      if (failed) return this.badRequest(res, failed.error);
      const orderDetails = createOrderDetails.map((detail) =>
        detail.getValue()
      );

      // 6. Make an order
      const createOrder = Order.create({
        customer,
        orderDetails,
        status: Status.PENDING,
        table,
        total,
      });
      if (createOrder.isFailure) return this.badRequest(res, createOrder.error);
      const order = createOrder.getValue();

      // 7. Save the order to persistency and clear the cart items.
      const newOrder = await this.orderRepo.save(order);
      if (newOrder.isFailure) {
        return this.unprocessableEntity(res, newOrder.error);
      }
      await this.cartRepo.clearCart(cart);

      // FINAL. Sends response back.
      this.created(res, newOrder.getValue());
    } catch (err) {
      console.log("[MakeOrderUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
