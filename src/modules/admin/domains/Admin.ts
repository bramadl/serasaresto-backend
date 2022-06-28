import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";
import { AdminEmail } from "./valueObjects/AdminEmail";
import { AdminName } from "./valueObjects/AdminName";
import { AdminPassword } from "./valueObjects/AdminPassword";

interface AdminProps {
  avatar?: string | null;
  name: AdminName;
  email: AdminEmail;
  password: AdminPassword;
  lastLoggedInAt?: Date;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Admin extends Entity<AdminProps> {
  constructor(props: AdminProps, id?: string) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get avatar(): string | null {
    if (!this.props.avatar) return null;
    return this.props.avatar as string;
  }

  get name(): AdminName {
    return this.props.name;
  }

  get email(): AdminEmail {
    return this.props.email;
  }

  get password(): AdminPassword {
    return this.props.password;
  }

  get role(): string {
    return this.props.role as string;
  }

  get lastLoggedInAt(): Date {
    return this.props.lastLoggedInAt as Date;
  }

  get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  get updatedAt(): Date {
    return this.props.updatedAt as Date;
  }

  public static create(props: AdminProps, id?: string): Result<Admin> {
    const guardResults = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "name" },
      { argument: props.email, argumentName: "email" },
      { argument: props.password, argumentName: "password" },
    ]);

    if (!guardResults.succeeded) {
      return Result.fail<Admin>(guardResults.message);
    }

    const resultProps = Result.combine([
      AdminName.create(props.name.value),
      AdminEmail.create(props.email.value),
      AdminPassword.create({
        isHashed: props.password.isHashed,
        value: props.password.value,
      }),
    ]);

    if (resultProps.isFailure) {
      return Result.fail<Admin>(resultProps.error);
    }

    const admin = new Admin(props, id);
    return Result.ok<Admin>(admin);
  }
}
