// import {prisma} from "./index"
// import { PrismaClient } from "@prisma/client";
// // import { PrismaClient } from "@packages/generated/prisma/client";
// const prisma = new PrismaClient()
import {prisma} from "../../../../lib/prisma.js"
// import prisma from "@packages/libs/prisma/index.js";
// import prisma from "@packages/libs/prisma/index.js";
// import prisma from "@packages/libs/prisma/index.js";
export const initailizeConfig = async () => {
  try {
    const existingConfig = await prisma.side_config.findFirst();
    if (!existingConfig) {
      await prisma.side_config.create({
        data: {
          categories: [
            "Electronics",
            "Fashion",
            "Home & Kitchen",
            "Sports & Fitness",
          ],
          subCategory: {
            "Electronics": ["Mobiles", "Laptops", "Accessories", "Gaming"],
            "Fashion": ["Men", "Women", "Kids", "Footwear"],
            "Home & Kitchen": ["Furniture", "Appliances", "Decor"],
            "Sports & Fitness": [
              "Gym Equipments",
              "Outdoor Sports",
              "Wearables",
            ],
          },
        },
      });
    }
  } catch (error) {
    console.log("Error initializing site config :",error)
  }
};
