import { MenuType, Prisma } from "@prisma/client";

import { Result } from "../../../../shared/logic/Result";
import { Menu } from "../../domains/Menu";
import { MenuMap } from "../../mappings/MenuMap";
import { IMenuRepo, PaginationConstructor, SearchOption } from "../IMenuRepo";

interface SearchOptionTransformed {
  search: string;
  perPage: number;
  page: number;
  type: MenuType;
}

export class MenuRepository implements IMenuRepo {
  private menuPrisma: Prisma.MenuDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;

  constructor(
    menuPrisma: Prisma.MenuDelegate<
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
  ) {
    this.menuPrisma = menuPrisma;
  }

  private buildOption(option: SearchOption): SearchOptionTransformed {
    return {
      page: option.page ? parseInt(option.page, 10) : 1,
      perPage: option.perPage ? parseInt(option.perPage, 10) : 4,
      search: option.search ? option.search.trim().toLowerCase() : "",
      type: option.type
        ? option.type === "minuman"
          ? MenuType.DRINK
          : MenuType.FOOD
        : MenuType.FOOD,
    };
  }

  private async buildPagination(
    perPage: number,
    page: number,
    type: MenuType
  ): Promise<PaginationConstructor> {
    const totalItems = await this.menuPrisma.count({ where: { type } });
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      page,
      perPage,
      totalItems,
      totalPages,
      hasNextItems: page < totalPages,
      hasPreviousItems: page !== 1,
    };
  }

  public async getMenus(
    option: SearchOption
  ): Promise<{ data: Result<Menu[]>; pagination: PaginationConstructor }> {
    const { perPage, page, search, type } = this.buildOption(option);
    const menus = await this.menuPrisma.findMany({
      where: {
        name: {
          contains: search,
        },
        type: type as MenuType,
      },
      skip: perPage * (page - 1),
      take: perPage,
    });
    const menuDomain = Result.ok<Menu[]>(MenuMap.toDomainArray(menus));
    const pagination = await this.buildPagination(perPage, page, type);
    return {
      data: menuDomain,
      pagination,
    };
  }

  public async findMenuById(id: string): Promise<Result<Menu>> {
    const find = await this.menuPrisma.findFirst({ where: { id } });
    if (!find) return Result.fail<Menu>("The menu couldnt be found.");
    const menu = MenuMap.toDomain(find);
    return Result.ok<Menu>(menu);
  }
}
