import { Customer as CustomerPrisma } from "@prisma/client";
import { Customer } from "../domains/Customer";
import { CustomerName } from "../domains/valueObjects/CustomerName";
import { CustomerToken } from "../domains/valueObjects/CustomerToken";

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
}
