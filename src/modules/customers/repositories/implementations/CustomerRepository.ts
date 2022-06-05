import { Prisma } from "@prisma/client";

import { CustomerName } from "../../domains/valueObjects/CustomerName";
import { TableToken } from "../../domains/valueObjects/TableToken";
import { ICustomerRepo } from "../ICustomerRepo";

export class CustomerRepository implements ICustomerRepo {
  private customerPrisma: Prisma.CustomerDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  constructor(
    customerPrisma: Prisma.CustomerDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  ) {
    this.customerPrisma = customerPrisma;
  }

  async reserveTableFor(
    customerName: CustomerName,
    tableToken: TableToken
  ): Promise<void> {
    await this.customerPrisma.create({
      data: {
        name: customerName.value,
        token: tableToken.value,
      },
    });
  }
}
