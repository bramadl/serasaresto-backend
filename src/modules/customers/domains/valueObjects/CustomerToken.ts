import { ValueObject } from "../../../../shared/core/ValueObject";
import { Guard } from "../../../../shared/logic/Guard";
import { Result } from "../../../../shared/logic/Result";

interface CustomerTokenProps {
  value: string;
}

export class CustomerToken extends ValueObject<CustomerTokenProps> {
  private constructor(props: CustomerTokenProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<CustomerToken> {
    const guardResult = Guard.againstNullOrUndefined({
      argument: value,
      argumentName: "customer token",
    });

    if (!guardResult.succeeded) {
      return Result.fail<CustomerToken>(guardResult.message);
    }

    if (value.trim().length < 4 || value.trim().length > 50) {
      return Result.fail<CustomerToken>(
        "Customer token must be at least greater than 4 and less than 50 characters"
      );
    }

    const customerToken = new CustomerToken({ value });
    return Result.ok<CustomerToken>(customerToken);
  }
}
