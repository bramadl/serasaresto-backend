import { Customer as CustomerPrisma, Order, Table } from "@prisma/client";
import { Customer } from "../domains/Customer";
import { CustomerName } from "../domains/valueObjects/CustomerName";
import { CustomerToken } from "../domains/valueObjects/CustomerToken";
import { FullCustomerDTO } from "../dtos/CustomerDTO";

export class CustomerMap {
  public static toDomain(customer: CustomerPrisma): Customer {
    const name = CustomerName.create(customer.name);
    const token = CustomerToken.create(customer.token as string);

    const createCustomer = Customer.create(
      {
        name: name.getValue(),
        token: token.getValue(),
      },
      customer.id
    );

    return createCustomer.getValue();
  }

  public static toDTO(
    customer: CustomerPrisma & {
      table: Table;
      orders: Order[];
    }
  ): FullCustomerDTO {
    return {
      id: customer.id,
      name: customer.name,
      ordersCount: customer.orders.length,
      reserveTableAt: customer.createdAt,
      loggedOutAt: customer.loggedOutAt as Date,
      tableNumber: customer.table.number,
    };
  }
}
