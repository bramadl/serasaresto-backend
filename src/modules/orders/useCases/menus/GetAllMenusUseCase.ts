import { Request, Response } from "express";
import { BaseController } from "../../../../shared/core/BaseController";
import { IMenuRepo } from "../../repositories/IMenuRepo";

export class GetAllMenusUseCase extends BaseController {
  private menuRepo: IMenuRepo;

  constructor(menuRepo: IMenuRepo) {
    super();
    this.menuRepo = menuRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      const menus = await this.menuRepo.getAll();
      const menusDTO = menus.map((menu) => ({
        id: menu.id,
        thumbnail: menu.thumbnail,
        name: menu.name,
        description: menu.description,
        price: menu.price,
        type: menu.type,
        inStock: menu.inStock,
      }));

      this.ok(res, menusDTO);
    } catch (err) {
      console.log("[GetAllMenusUseCaseError]", err);
      this.internalServerError(res, (err as Error).message);
    }
  }
}
