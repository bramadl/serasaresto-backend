import { Prisma } from "@prisma/client";

import { Result } from "../../../../shared/logic/Result";
import { Table } from "../../domains/Table";
import { TableNumber } from "../../domains/valueObjects/TableNumber";
import { TableToken } from "../../domains/valueObjects/TableToken";
import { TableMap } from "../../mappings/TableMap";
import { ITableRepo } from "../ITableRepo";

export class TableRepository implements ITableRepo {
  private prismaTable: Prisma.TableDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  constructor(
    prismaTable: Prisma.TableDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  ) {
    this.prismaTable = prismaTable;
  }

  async findById(id: string): Promise<Result<Table>> {
    const table = await this.prismaTable.findFirst({ where: { id } });
    if (!table) return Result.fail<Table>("The table could not be found.");
    return Result.ok<Table>(TableMap.toDomain(table));
  }

  async findByTableNumber(number: TableNumber): Promise<Result<Table>> {
    const table = await this.prismaTable.findFirst({
      where: {
        number: number.value,
      },
    });
    if (!table) return Result.fail<Table>("The table could not be found.");
    return Result.ok<Table>(TableMap.toDomain(table));
  }

  async updateTableToken(id: string, token: TableToken): Promise<void> {
    await this.prismaTable.update({
      where: {
        id,
      },
      data: {
        token: token.value,
      },
    });
  }
}
