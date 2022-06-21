import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { PrismaClient, Table } from "@prisma/client";
import { TableToken } from "../../../modules/customers/domains/valueObjects/TableToken";
const prisma = new PrismaClient();

async function main() {
  function generateTable(tableCode: string): Table[] {
    const values: Table[] = [];

    for (let i = 1; i <= 50; i++) {
      const tableNumber = i < 10 ? `${tableCode}0${i}` : `${tableCode}${i}`;

      values.push({
        id: uuid(),
        number: tableNumber,
        isReserved: false,
        token: TableToken.generateToken(tableNumber),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return values;
  }

  function generateTableCart(tables: Table[]) {
    const values = [];

    const mappedTables = tables.map((table) => {
      return { id: table.id };
    });

    for (let i = 0; i < mappedTables.length; i++) {
      values.push({
        tableId: mappedTables[i].id,
        total: 0,
      });
    }

    return values;
  }

  const tablesForACode = generateTable("A");
  const tablesForBCode = generateTable("B");

  const cartsForACode = generateTableCart(tablesForACode);
  const cartsForBCode = generateTableCart(tablesForBCode);

  console.log({
    tablesForACode,
    tablesForBCode,
    cartsForACode,
    cartsForBCode,
  });

  await prisma.table.createMany({
    data: [...tablesForACode, ...tablesForBCode],
    skipDuplicates: true,
  });

  await prisma.cart.createMany({
    data: [
      ...generateTableCart(tablesForACode),
      ...generateTableCart(tablesForBCode),
    ],
    skipDuplicates: true,
  });

  await prisma.menu.createMany({
    data: [
      {
        id: "b6146a10-9a22-4e03-a3ae-af5c0a19f89d",
        thumbnail:
          "https://images.unsplash.com/photo-1607532941433-304659e8198a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1556&q=80",
        name: "Prawn with Salad",
        description: "Prawn with delicious salad, garlic, and sweet sauce",
        price: 40000,
        inStock: true,
        type: "FOOD",
      },
      {
        id: "22d3e25a-5c1c-4345-a45b-5cc5bcd0c233",
        thumbnail:
          "https://images.unsplash.com/photo-1571047399553-603e2138b646?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
        name: "Healthy Salad",
        description: "Fresh vegetables and good quality salad",
        price: 50000,
        inStock: true,
        type: "FOOD",
      },
      {
        id: "2aeb03cc-5ded-4fe3-a5b6-e28ef87505cc",
        thumbnail:
          "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80",
        name: "Smoothies Bowl",
        description: "Dragon Fruit mix with Strawberry and Banana",
        price: 40000,
        inStock: true,
        type: "FOOD",
      },
      {
        id: "333a4e0b-4d16-4b93-975a-a7d3e7aa7260",
        thumbnail:
          "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80",
        name: "Spagetthi Carbonara",
        description: "Carbonara with Cheese melt and fresh milk",
        price: 40000,
        inStock: false,
        type: "FOOD",
      },
      {
        id: "6743e5d2-25ba-4dac-a1c8-852475c11ac7",
        thumbnail:
          "https://images.unsplash.com/photo-1507120366498-4656eaece7fa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1742&q=80",
        name: "Pome Juice",
        description: "Fresh Pome with Kiwi and berry",
        price: 40000,
        inStock: true,
        type: "DRINK",
      },
      {
        id: "3133b9d8-cb1e-4df2-9c08-f0f297f19cd4",
        thumbnail:
          "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
        name: "Orange Juice",
        description: "Fresh Orange with Lime and Soda",
        price: 40000,
        inStock: true,
        type: "DRINK",
      },
    ],
    skipDuplicates: true,
  });

  await prisma.admin.create({
    data: {
      name: "Admin",
      email: "admin@admin.com",
      password: await bcrypt.hash("admin", 10),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
