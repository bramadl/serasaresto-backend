import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { ITableRepo } from "../../../customers/repositories/ITableRepo";
import { ICartRepo } from "../../repositories/ICartRepo";
import { IMenuRepo } from "../../repositories/IMenuRepo";

export class RemoveItemFromCartUseCase extends BaseController {
  private cartRepo: ICartRepo;
  private menuRepo: IMenuRepo;
  private tableRepo: ITableRepo;

  constructor(cartRepo: ICartRepo, menuRepo: IMenuRepo, tableRepo: ITableRepo) {
    super();
    this.cartRepo = cartRepo;
    this.menuRepo = menuRepo;
    this.tableRepo = tableRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      console.log("first");
    } catch (err) {
      console.log("[RemoveItemFromCartUseCase]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
