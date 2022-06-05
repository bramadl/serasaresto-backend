export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error?: string;
  private _value?: T;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        "Can not have a result with both success and error state."
      );
    }

    if (!isSuccess && !error) {
      throw new Error(
        "Can not have a result without one of success or error state."
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error("Can not get the value of an error result.");
    }

    return this._value as T;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result(true, undefined, value);
  }

  public static fail<U>(error: any): Result<U> {
    return new Result(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }

    return Result.ok<any>();
  }
}
