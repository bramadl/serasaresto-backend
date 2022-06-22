import {
  Customer as CustomerPrisma,
  Order,
  Prisma,
  Table as TablePrisma,
} from "@prisma/client";

import { Customer } from "../../domains/Customer";
import { Table } from "../../domains/Table";
import { CustomerName } from "../../domains/valueObjects/CustomerName";
import { TableNumber } from "../../domains/valueObjects/TableNumber";
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

  async countCustomers(): Promise<number> {
    return this.customerPrisma.count();
  }

  async getLatestTen(): Promise<
    (CustomerPrisma & { table: TablePrisma; orders: Order[] })[]
    // eslint-disable-next-line indent
  > {
    const customers = await this.customerPrisma.findMany({
      include: { orders: true, table: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return customers;
  }

  async findByTable(table: Table): Promise<Customer | null> {
    const foundCustomer = await this.customerPrisma.findFirst({
      where: { table: { id: table.id }, loggedOutAt: null },
    });
    if (!foundCustomer) return null;
    return CustomerMap.toDomain(foundCustomer);
  }

  async reserveTableFor(
    customerName: CustomerName,
    tableToken: TableToken,
    tableNumber: TableNumber
  ): Promise<void> {
    await this.customerPrisma.create({
      data: {
        name: customerName.value,
        token: tableToken.value,
        tableNumber: tableNumber.value,
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
