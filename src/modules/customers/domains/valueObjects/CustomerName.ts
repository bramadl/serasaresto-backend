import { ValueObject } from "../../../../shared/core/ValueObject";
import { Guard } from "../../../../shared/logic/Guard";
import { Result } from "../../../../shared/logic/Result";

interface CustomerNameProps {
  value: string;
}

export class CustomerName extends ValueObject<CustomerNameProps> {
  private constructor(props: CustomerNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(value: string): Result<CustomerName> {
    const guardResult = Guard.againstNullOrUndefined({
      argument: value,
      argumentName: "customer name",
    });

    if (!guardResult.succeeded) {
      return Result.fail<CustomerName>(guardResult.message);
    }

    if (value.trim().length < 4 || value.trim().length > 50) {
      return Result.fail<CustomerName>(
        "Customer name must be at least greater than 4 and less than 50 characters"
      );
    }

    const customerName = new CustomerName({ value });
    return Result.ok<CustomerName>(customerName);
  }
}
