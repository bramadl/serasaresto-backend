import { CustomerModel } from "../../../app/database/models/Customer";
import { Customer } from "../domains/Customer";
import { CustomerName } from "../domains/valueObjects/CustomerName";
import { CustomerToken } from "../domains/valueObjects/CustomerToken";
import { CustomerDTO } from "../dtos/CustomerDTO";

interface IPersistence {
  model: CustomerModel;
  raw: Customer;
}

export class CustomerMap {
  public static toDomain(raw: any): Customer {
    const customer = Customer.create(
      {
        name: CustomerName.create(raw.name).getValue(),
        token: CustomerToken.create(raw.token).getValue(),
      },
      raw.id
    );

    return customer.getValue();
  }

  public static toDTO(customer: Customer): CustomerDTO {
    return {
      id: customer.id,
      name: customer.name.value,
      token: customer.token.value,
    };
  }

  public static toPersistence(props: IPersistence): CustomerModel {
    const { model, raw } = props;

    model.id = raw.id.toString();
    model.name = raw.name.value;
    model.token = raw.token.value;

    return model;
  }
}
