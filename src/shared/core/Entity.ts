import { v4 as uuid } from "uuid";

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: string;
  protected props: T;

  constructor(props: T, id?: string) {
    this.props = props;
    this._id = id || uuid();
  }

  public equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    if (!isEntity(entity)) {
      return false;
    }

    return this._id === entity._id;
  }
}
