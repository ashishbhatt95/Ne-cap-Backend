const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🚖 NE Cab Backend API",
      version: "1.0.0",
      description: `
Passenger & Rider APIs with OTP, Cloudinary uploads, and MongoDB integration.

💡 Tip: Use the "Authorize" button with your JWT to try any protected endpoints!
📧 Contact: [Bhatt Tech Solutions](mailto:support@bhatttechsolutions.in)
      `,
    },
    servers: [
      { url: "http://localhost:5000", description: "Local Development" },
      { url: "https://ne-cap-backend.onrender.com", description: "Production Server" },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token here. Just paste the token, no 'Bearer ' needed",
        },
      },
    },
    security: [{ BearerAuth: [] }], // applies globally
  },
  apis: ["./src/swagger/*.js"], // scan all Swagger route docs
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("📘 Swagger Docs: http://localhost:5000/api-docs");
};

module.exports = swaggerDocs;
