const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const serverUrl = process.env.SERVER_URL || "https://hospital-management-n0dm.onrender.com";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hospital Management API",
      version: "1.0.0",
      description: "API for managing patients and doctors in a hospital system"
    },
    servers: [
      {
        url: serverUrl
      }
    ]
  },
  apis: ["./routes/*.js"] 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec
};