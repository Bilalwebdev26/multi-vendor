// import { PrismaClient } from '../../generated/prisma/client'; // path adjust according to file location
import { PrismaClient } from "../../generated/prisma/client.js";
import dotenv from "dotenv";
dotenv.config();
declare global{
     namespace globalThis{
        var prismaDB:PrismaClient;
     }
}

const prisma  = new PrismaClient()
if(process.env.NODE_ENV !== "production"){
    globalThis.prismaDB = prisma;
}
export default prisma;

// import { PrismaClient } from "@prisma/client";

// declare global {
//   // Global variable type declaration
//   var prismaDB: PrismaClient | undefined;
// }

// const prisma = globalThis.prismaDB ?? new PrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalThis.prismaDB = prisma;
// }

// export default prisma;

