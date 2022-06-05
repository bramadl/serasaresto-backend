import { Entity } from "../../../shared/core/Entity";
import { Result } from "../../../shared/logic/Result";
import { CustomerName } from "./valueObjects/CustomerName";
import { CustomerToken } from "./valueObjects/CustomerToken";

interface CustomerProps {
  name: CustomerName;
  token: CustomerToken;
}

export class Customer extends Entity<CustomerProps> {
  private constructor(props: CustomerProps, id?: string) {
    super(props, id);
  }

  get id(): string {
    return this._id;
  }

  get name(): CustomerName {
    return this.props.name;
  }

  get token(): CustomerToken {
    return this.props.token;
  }

  public static create(props: CustomerProps, id?: string): Result<Customer> {
    const { name, token } = props;

    const customerNameOrError = CustomerName.create(name.value);
    const customerTokenOrError = CustomerToken.create(token.value);

    const propsResults = Result.combine([
      customerNameOrError,
      customerTokenOrError,
    ]);

    if (propsResults.isFailure) {
      return Result.fail<Customer>(propsResults.error);
    }

    const customer = new Customer(
      {
        name: customerNameOrError.getValue(),
        token: customerTokenOrError.getValue(),
      },
      id
    );

    return Result.ok<Customer>(customer);
  }
}
