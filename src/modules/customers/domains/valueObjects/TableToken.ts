import crypto from "crypto-js";

import { ValueObject } from "../../../../shared/core/ValueObject";
import { Guard } from "../../../../shared/logic/Guard";
import { Result } from "../../../../shared/logic/Result";

interface TableTokenProps {
  value: string;
  tableNumber?: string;
}

export class TableToken extends ValueObject<TableTokenProps> {
  private constructor(props: TableTokenProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static generateToken(tableNumber: string): string {
    const payload = {
      table_number: tableNumber,
      issued_at: new Date().toISOString(),
    };

    const encrypted = crypto.AES.encrypt(JSON.stringify(payload), "secret");
    return encrypted.toString();
  }

  public static create(props: TableTokenProps): Result<TableToken> {
    let token = props.value;
    if (!token) {
      if (!props.tableNumber) {
        return Result.fail<TableToken>("Jancok lu");
      }

      token = this.generateToken(props.tableNumber);
    }

    const guardResult = Guard.againstNullOrUndefined({
      argument: token,
      argumentName: "table token",
    });

    if (!guardResult.succeeded) {
      return Result.fail<TableToken>(guardResult.message);
    }

    const tableToken = new TableToken({ value: token });
    return Result.ok<TableToken>(tableToken);
  }
}
