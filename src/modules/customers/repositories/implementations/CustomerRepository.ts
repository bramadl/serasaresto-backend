import { Customer as CustomerPrisma, Prisma } from "@prisma/client";

import { Result } from "../../../../shared/logic/Result";
import { Customer } from "../../domains/Customer";
import { CustomerName } from "../../domains/valueObjects/CustomerName";
import { TableToken } from "../../domains/valueObjects/TableToken";
import { CustomerMap } from "../../mappings/CustomerMap";
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

  private async findById(id: string): Promise<CustomerPrisma | null> {
    const customer = await this.customerPrisma.findFirst({ where: { id } });
    if (!customer) return null;
    return customer;
  }

  async findByToken(token: string): Promise<Result<Customer>> {
    const foundCustomer = await this.customerPrisma.findFirst({
      where: { token, loggedOutAt: null },
    });
    if (!foundCustomer) {
      return Result.fail<Customer>("Customer could not be found.");
    }
    return Result.ok<Customer>(CustomerMap.toDomain(foundCustomer));
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

  async logsOutCustomer(id: string): Promise<void> {
    const customer = await this.findById(id);
    if (!customer) return;
    await this.customerPrisma.update({
      where: { id },
      data: { loggedOutAt: new Date() },
    });
  }
}
