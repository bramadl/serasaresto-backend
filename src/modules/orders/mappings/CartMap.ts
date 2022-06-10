import {
  Cart as PrismaCart,
  CartItem as PrismaCartItem,
  Menu as PrismaMenu,
  Table as PrismaTable,
} from "@prisma/client";
import { Table } from "../../customers/domains/Table";
import { TableNumber } from "../../customers/domains/valueObjects/TableNumber";
import { TableToken } from "../../customers/domains/valueObjects/TableToken";
import { Cart } from "../domains/Cart";
import { CartItem } from "../domains/CartItem";
import { Menu } from "../domains/Menu";
import { ICartDTO } from "../dtos/ICartDTO";

export class CartMap {
  public static toDomain(
    cart: PrismaCart & { table: PrismaTable } & {
      cartItems: (PrismaCartItem & {
        menu: PrismaMenu;
      })[];
    }
  ): Cart {
    if (!cart.table.token) throw new Error("Table must have a token");

    const createCart = Cart.create(
      {
        table: Table.create(
          {
            isReserved: cart.table.isReserved,
            number: TableNumber.create(cart.table.number).getValue(),
            token: TableToken.create({ value: cart.table.token }).getValue(),
          },
          cart.table.id
        ).getValue(),
        cartItems: cart.cartItems.map((cartItem) =>
          CartItem.create(
            {
              menu: Menu.create(
                {
                  description: cartItem.menu.description,
                  inStock: cartItem.menu.inStock,
                  name: cartItem.menu.name,
                  price: cartItem.menu.price,
                  type: cartItem.menu.type,
                  thumbnail: cartItem.menu.thumbnail,
                },
                cartItem.menu.id
              ).getValue(),
              quantity: cartItem.quantity,
              note: cartItem.note,
            },
            cartItem.id
          ).getValue()
        ),
        total: cart.total,
      },
      cart.id
    );

    return createCart.getValue();
  }

  public static toDTO(cart: Cart): ICartDTO {
    return {
      id: cart.id,
      cartItems: cart.cartItems.map((cartItem) => ({
        menu: {
          name: cartItem.menu.name,
          description: cartItem.menu.description,
          inStock: cartItem.menu.inStock,
          price: cartItem.menu.price,
          thumbnail: cartItem.menu.thumbnail,
          type: cartItem.menu.type,
        },
        note: cartItem.note,
        quantity: cartItem.quantity,
      })),
      total: cart.total,
    };
  }
}
