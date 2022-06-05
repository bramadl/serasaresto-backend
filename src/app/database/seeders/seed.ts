import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  function generateTable(tableCode: string) {
    const values = [];

    for (let i = 1; i <= 50; i++) {
      values.push({
        number: i < 10 ? `${tableCode}0${i}` : `${tableCode}${i}`,
      });
    }

    return values;
  }

  await prisma.table.createMany({
    data: [...generateTable("A"), ...generateTable("B")],
    skipDuplicates: true,
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
