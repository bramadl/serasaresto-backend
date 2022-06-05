import { ValueObject } from "../../../../shared/core/ValueObject";
import { Guard } from "../../../../shared/logic/Guard";
import { Result } from "../../../../shared/logic/Result";

interface TableNumberProps {
  value: string;
}

export class TableNumber extends ValueObject<TableNumberProps> {
  private constructor(props: TableNumberProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<TableNumber> {
    const baseProps = {
      argument: value,
      argumentName: "table number",
    };

    const guardResult = Guard.againstNullOrUndefined(baseProps);

    if (!guardResult.succeeded) {
      return Result.fail<TableNumber>(guardResult.message);
    }

    const lengthResult = Guard.againstLengthShouldBe({
      ...baseProps,
      value: 3,
    });

    if (!lengthResult.succeeded) {
      return Result.fail<TableNumber>(guardResult.message);
    }

    const tableNumber = new TableNumber({ value });
    return Result.ok<TableNumber>(tableNumber);
  }
}
