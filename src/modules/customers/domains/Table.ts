import crypto from "crypto-js";

import { Entity } from "../../../shared/core/Entity";
import { Result } from "../../../shared/logic/Result";
import { TableNumber } from "./valueObjects/TableNumber";
import { TableToken } from "./valueObjects/TableToken";

interface TableProps {
  number: TableNumber;
  token: TableToken;
  isReserved: boolean;
}

export class Table extends Entity<TableProps> {
  private constructor(props: TableProps, id?: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
  }

  get number(): TableNumber {
    return this.props.number;
  }

  get token(): TableToken {
    return this.props.token as TableToken;
  }

  set token(value: TableToken) {
    this.token = value;
  }

  public isReserved(): boolean {
    return this.props.isReserved;
  }

  public decryptTableToken(tableTokenEncrypted: string): string {
    const result = crypto.AES.decrypt(tableTokenEncrypted, "secret");
    return result.toString(crypto.enc.Utf8);
  }

  public static create(props: TableProps, id?: string): Result<Table> {
    const number = props.number.value;
    const token = props.token.value;

    const tableNumberOrError = TableNumber.create(number);
    const tableTokenOrError = TableToken.create({
      value: token,
      tableNumber: props.number.value,
    });

    const propsResults = Result.combine([
      tableNumberOrError,
      tableTokenOrError,
    ]);

    if (propsResults.isFailure) {
      return Result.fail<Table>(propsResults.error);
    }

    const table = new Table(
      {
        number: tableNumberOrError.getValue(),
        token: tableTokenOrError.getValue(),
        isReserved: props.isReserved,
      },
      id
    );

    return Result.ok<Table>(table);
  }
}
