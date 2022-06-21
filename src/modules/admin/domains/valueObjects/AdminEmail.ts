import { ValueObject } from "../../../../shared/core/ValueObject";
import { Guard } from "../../../../shared/logic/Guard";
import { Result } from "../../../../shared/logic/Result";

interface AdminEmailProps {
  value: string;
}

const EMAIL_REGEX =
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

export class AdminEmail extends ValueObject<AdminEmailProps> {
  private constructor(props: AdminEmailProps) {
    super(props);
  }

  get value() {
    return this.props.value;
  }

  public static create(value: string): Result<AdminEmail> {
    const guardResult = Guard.againstNullOrUndefined({
      argument: value,
      argumentName: "email",
    });

    if (!guardResult.succeeded) {
      return Result.fail<AdminEmail>(guardResult.message);
    }

    if (!EMAIL_REGEX.test(value)) {
      return Result.fail<AdminEmail>("Invalid email format");
    }

    const adminEmail = new AdminEmail({ value });
    return Result.ok<AdminEmail>(adminEmail);
  }
}
