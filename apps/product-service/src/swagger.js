//import swaggerAutogen from "swagger-autogen"
const swaggerAutogen = require("swagger-autogen")
const docs={
    info:{
        title:"Product Service Api",
        description: "Automatically generated Swagger docs",
        version: "1.0.0"
    },
    host: "localhost:6002",
    schemes:["http"]
}

const outputFile = "./swagger-output.json"
const endpointsFiles = ["./routes/product.routes.ts"] 
swaggerAutogen()(outputFile,endpointsFiles,docs)