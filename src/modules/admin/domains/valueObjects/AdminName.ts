import { ValueObject } from "../../../../shared/core/ValueObject";
import { Guard } from "../../../../shared/logic/Guard";
import { Result } from "../../../../shared/logic/Result";

interface AdminNameProps {
  value: string;
}

export class AdminName extends ValueObject<AdminNameProps> {
  private constructor(props: AdminNameProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  public static create(value: string): Result<AdminName> {
    const guardResult = Guard.againstNullOrUndefined({
      argument: value,
      argumentName: "name",
    });

    if (!guardResult.succeeded) {
      return Result.fail<AdminName>(guardResult.message);
    }

    const leastResult = Guard.againstAtLeast({
      argument: value,
      argumentName: "name",
      value: 4,
    });

    if (!leastResult.succeeded) {
      return Result.fail<AdminName>(leastResult.message);
    }

    const mostResult = Guard.againstAtMost({
      argument: value,
      argumentName: "name",
      value: 20,
    });

    if (!mostResult.succeeded) {
      return Result.fail<AdminName>(mostResult.message);
    }

    const adminName = new AdminName({ value });
    return Result.ok<AdminName>(adminName);
  }
}
