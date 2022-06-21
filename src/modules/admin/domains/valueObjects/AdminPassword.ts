import bcrypt from "bcrypt";

import { ValueObject } from "../../../../shared/core/ValueObject";
import { Guard } from "../../../../shared/logic/Guard";
import { Result } from "../../../../shared/logic/Result";

interface AdminPasswordProps {
  value: string;
  isHashed: boolean;
}

export class AdminPassword extends ValueObject<AdminPasswordProps> {
  private constructor(props: AdminPasswordProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  get isHashed() {
    return this.props.isHashed;
  }

  comparePassword(plainPassword: string): boolean {
    if (this.isHashed) {
      return bcrypt.compareSync(plainPassword, this.value);
    }

    return plainPassword === this.value;
  }

  static encryptPassword(plainPassword: string): string {
    return bcrypt.hashSync(plainPassword, 10);
  }

  public static create(props: AdminPasswordProps): Result<AdminPassword> {
    const { isHashed, value } = props;

    // When isHashed is false, it means we set a new password from plain.
    if (!isHashed) {
      const guardResult = Guard.againstNullOrUndefined({
        argument: value,
        argumentName: "password",
      });

      if (!guardResult.succeeded) {
        return Result.fail<AdminPassword>(guardResult.message);
      }

      const leastResult = Guard.againstAtLeast({
        argument: value,
        argumentName: "password",
        value: 4,
      });

      if (!leastResult.succeeded) {
        return Result.fail<AdminPassword>(leastResult.message);
      }

      const encryptedPassword = this.encryptPassword(value);
      const adminPassword = new AdminPassword({
        isHashed,
        value: encryptedPassword,
      });
      return Result.ok<AdminPassword>(adminPassword);
    }

    // Creating a hashed value password.
    const adminPassword = new AdminPassword({ value, isHashed });
    return Result.ok<AdminPassword>(adminPassword);
  }
}
