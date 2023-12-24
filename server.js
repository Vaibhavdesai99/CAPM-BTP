const express = require("express");
const cds = require("@sap/cds");
const app = express();

// Register CDS service
cds.connect.to("db"); // Connect to the database defined in the cds configuration

// Use SAP CDS with Express
async function startServer() {
  await cds.server(app);
  app.listen(5000, () => {
    console.log(`Server running on port 3000`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
