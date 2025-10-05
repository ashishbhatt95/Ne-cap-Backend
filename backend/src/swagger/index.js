const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🚖 NE Cab Backend API",
      version: "1.0.0",
      description: "Passenger & Rider APIs with OTP, Cloudinary uploads, and MongoDB integration",
      contact: { name: "Bhatt Tech Solutions", email: "support@bhatttechsolutions.in" },
    },
    servers: [
      { url: "http://localhost:5000", description: "Local Development" },
      { url: "https://ne-cap-backend.onrender.com", description: "Production Server" },
    ],
  },
  apis: ["./src/swagger/*.js"], // scan all swagger files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs: http://localhost:5000/api-docs");
};

module.exports = swaggerDocs;
