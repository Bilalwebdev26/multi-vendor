// import { PrismaClient } from '../../generated/prisma/client'; // path adjust according to file location
// import { PrismaClient } from "../../generated/prisma/client.js";
// import dotenv from "dotenv";
// dotenv.config();
// declare global{
//      namespace globalThis{
//         var prismaDB:PrismaClient;
//      }
// }

// const prisma  = new PrismaClient()
// if(process.env.NODE_ENV !== "production"){
//     globalThis.prismaDB = prisma;
// }
// export default prisma;

// src/prisma/client.ts
import dotenv from "dotenv";
dotenv.config(); // <-- load env first

import { PrismaClient } from "../../generated/prisma/client.js"; // adjust path if needed

declare global {
  // allow globalThis.prismaDB to be reused across hot reloads
  // eslint-disable-next-line no-var
  var prismaDB: PrismaClient | undefined;
}

const prisma: PrismaClient = globalThis.prismaDB ?? new PrismaClient({
  log: ["error", "warn"], // optionally enable logs
});

// In development, attach to global to prevent creating multiple instances after HMR/hot reload
if (process.env.NODE_ENV !== "production") {
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

