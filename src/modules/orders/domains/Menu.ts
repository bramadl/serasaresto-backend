import { Entity } from "../../../shared/core/Entity";
import { Guard } from "../../../shared/logic/Guard";
import { Result } from "../../../shared/logic/Result";

interface MenuProps {
  name: string;
  description: string;
  price: number;
  thumbnail?: string;
  inStock: boolean;
  type: "FOOD" | "DRINK";
}

export class Menu extends Entity<MenuProps> {
  private constructor(props: MenuProps, id?: string) {
    super(props, id);
  }

  get id(): string {
    return this._id.toString();
  }

  get name(): string {
    return this.props.name;
  }

  get price(): number {
    return this.props.price;
  }

  get description(): string {
    return this.props.description;
  }

  get thumbnail(): string {
    return this.props.thumbnail as string;
  }

  get inStock(): boolean {
    return this.props.inStock;
  }

  get type(): "FOOD" | "DRINK" {
    return this.props.type;
  }

  public static create(props: MenuProps, id?: string): Result<Menu> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: "menu name" },
      { argument: props.price, argumentName: "menu price" },
      { argument: props.inStock, argumentName: "menu stock" },
      { argument: props.type, argumentName: "menu type" },
    ]);

    if (!guardResult.succeeded) return Result.fail<Menu>(guardResult.succeeded);

    const menu = new Menu(props, id);
    return Result.ok<Menu>(menu);
  }
}
