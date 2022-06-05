interface IGuardResult {
  succeeded: boolean;
  message?: string;
}

interface IGuardArgument {
  argument: any;
  argumentName: string;
}

interface INumericGuard extends IGuardArgument {
  value: number;
}

export class Guard {
  static combine(guardResults: IGuardResult[]): IGuardResult {
    for (const result of guardResults) {
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }

  static againstLengthShouldBe(arg: INumericGuard): IGuardResult {
    if (arg.argument.length !== arg.value) {
      return {
        succeeded: false,
        message: `${arg.argumentName} characters is not ${arg.value} characters`,
      };
    } else {
      return {
        succeeded: true,
      };
    }
  }

  static againstAtLeast(arg: INumericGuard): IGuardResult {
    if (arg.argument.length < arg.value) {
      return {
        succeeded: false,
        message: `${arg.argumentName} is lower than ${arg.value} characters`,
      };
    } else {
      return {
        succeeded: true,
      };
    }
  }

  static againstAtMost(arg: INumericGuard): IGuardResult {
    if (arg.argument.length > arg.value) {
      return {
        succeeded: false,
        message: `${arg.argumentName} is greater than ${arg.value} characters`,
      };
    } else {
      return {
        succeeded: true,
      };
    }
  }

  static againstNullOrUndefined(arg: IGuardArgument): IGuardResult {
    if (arg.argument === null || arg.argument === undefined) {
      return {
        succeeded: false,
        message: `${arg.argumentName} is null or undefined.`,
      };
    } else {
      return {
        succeeded: true,
      };
    }
  }

  static againstNullOrUndefinedBulk(args: IGuardArgument[]): IGuardResult {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(arg);
      if (!result.succeeded) return result;
    }

    return { succeeded: true };
  }
}
