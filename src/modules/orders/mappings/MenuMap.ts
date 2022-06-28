import { Menu as MenuPrisma } from "@prisma/client";
import { Menu } from "../domains/Menu";
import { IMenuDTO } from "../dtos/IMenuDTO";

export class MenuMap {
  public static toDomain(menu: MenuPrisma): Menu {
    return Menu.create(
      {
        name: menu.name,
        description: menu.description as string,
        price: menu.price,
        thumbnail: menu.thumbnail || undefined,
        inStock: menu.inStock,
        type: menu.type,
      },
      menu.id
    ).getValue();
  }

  public static toDomainArray(menus: MenuPrisma[]): Menu[] {
    return menus.map((prismaMenu: MenuPrisma) => {
      return Menu.create(
        {
          name: prismaMenu.name,
          description: prismaMenu.description as string,
          price: prismaMenu.price,
          thumbnail: prismaMenu.thumbnail || undefined,
          inStock: prismaMenu.inStock,
          type: prismaMenu.type,
        },
        prismaMenu.id
      ).getValue();
    });
  }

  public static toDTO(menus: Menu[]): IMenuDTO[] {
    return menus.map((menu: Menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      price: menu.price,
      thumbnail: menu.thumbnail,
      inStock: menu.inStock,
      type: menu.type,
    }));
  }
}
