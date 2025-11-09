//import swaggerAutogen from "swagger-autogen"
const swaggerAutogen = require("swagger-autogen")
const docs={
    info:{
        title:"Auth Service Api",
        description: "Automatically generated Swagger docs",
        version: "1.0.0"
    },
    host: "localhost:6001",
    schemes:["http"]
}

const outputFile = "./swagger-output.json"
const endpointsFiles = ["./routes/auth.routes"] 
swaggerAutogen()(outputFile,endpointsFiles,docs)