import { prisma } from "@lib/prisma";
import { create } from "domain";

export const updateUserAnalytics = async (event: any) => {
  try {
    const existingData = await prisma.userAnalytics.findUnique({
      where: {
        userId: event.userId,
      },
    });
    let updatedAction: any = existingData?.actions || [];
    const actionExists = updatedAction.some(
      (entry: any) =>
        entry.productId === event.productId && event.action === entry.action
    ); //event=event
    //always store product_view for recomendation
    if (event.action === "product_view") {
      updatedAction.push({
        productId: event?.productId,
        shopId: event.shopId,
        action: event?.action,
        timestamp: new Date(),
      });
    } else if (
      ["add_to_wishlist", "add_to_cart"].includes(event.action) &&
      !actionExists
    ) {
      updatedAction.push({
        productId: event?.productId,
        shopId: event.shopId,
        action: event?.action,
        timestamp: new Date(),
      });
    } else if (event.action === "remove_from_cart") {
      updatedAction = updatedAction.filter(
        (entry: any) =>
          !(
            entry.productId === event.productId &&
            entry.action === "add_to_cart"
          )
      );
    }
    //keep only last 100 actions
    if (updatedAction.length > 100) {
      updatedAction.shift();
    }
    const extraFields: Record<string, null> = {};
    if (event.country) {
      extraFields.country = event.country;
    }
    if (event.city) {
      extraFields.city = event.city;
    }
    if (event.device) {
      extraFields.device = event.device;
    }
    //update and create user data analatics
    await prisma.userAnalytics.upsert({
      where: { userId: event.userId },
      update: {
        lastVisted: new Date(),
        action: updatedAction,
        ...extraFields,
      },
      create: {
        userId: event?.userId,
        lastVisted: new Date(),
        action: updatedAction,
        ...extraFields,
      },
    });
    //also updated product annalytics
    
  } catch (error) {}
};
