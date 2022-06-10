import { Request, Response } from "express";

import { BaseController } from "../../../../shared/core/BaseController";
import { MenuMap } from "../../mappings/MenuMap";
import { IMenuRepo } from "../../repositories/IMenuRepo";

export class GetMenusUseCase extends BaseController {
  private menuRepo: IMenuRepo;

  constructor(menuRepo: IMenuRepo) {
    super();
    this.menuRepo = menuRepo;
  }

  public async executeImpl(req: Request, res: Response): Promise<any> {
    try {
      // 1. Parse the incoming request queries.
      const {
        search: searchQuery,
        per_page: perPageQuery,
        page: pageQuery,
        type: typeQuery,
      } = req.query;

      // 2. Get the menu list.
      const { data, pagination } = await this.menuRepo.getMenus({
        page: pageQuery as string,
        perPage: perPageQuery as string,
        search: searchQuery as string,
        type: typeQuery as string,
      });

      // 3. Map the domain data to DTO interface.
      const menusDTO = MenuMap.toDTO(data.getValue());
      const paginationDTO = pagination;

      // FINAL. Return the response.
      this.ok(res, { menu: menusDTO, pagination: paginationDTO });
    } catch (err) {
      console.log("[GetMenusUseCaseError]", err);
      this.internalServerError(res, err);
    }
  }
}
