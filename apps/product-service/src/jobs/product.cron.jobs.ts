import { prisma } from "../../../../lib/prisma.js";
import cron from "node-cron";
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    //checking deleeing product older than now
    await prisma.products.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: now },
      },
    });
    // console.log(`${deletedProduct.count} expired products permanently deleted.`)
  } catch (error) {
    console.log(error);
  }
});
