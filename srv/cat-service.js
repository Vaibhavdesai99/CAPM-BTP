const cds = require("@sap/cds");

module.exports = async (srv) => {
  const db = await cds.connect.to({
    kind: "postgres",
    credentials: {
      host: "localhost",
      port: 5432,
      user: "postgres",
      password: "ramchandra@1999",
      database: "postgres",
    },
  });

  srv.on("CREATE", "Products", async (req) => {
    const { data } = req;

    try {
      await insertData(db, data);
    } catch (error) {
      console.log("errorshow", error);
    }
  });

  srv.on("READ", "Products", async (req) => {
    return handleReadProducts(db);
  });
};

async function insertData(db, data) {
  console.log("datacoming", data);
  const query = INSERT.into("capmProject_products").entries([
    { name: data.name, description: data.description },
  ]);

  try {
    const result = await db.run(query);
    console.log("newName", result);
    return result;
  } catch (error) {
    console.log("error handling", error);
  }
}

const handleReadProducts = async (db) => {
  try {
    const results = await db.run(SELECT.from("capmProject_products"));
    return results;
  } catch (error) {
    console.error("Error connecting to PostgreSQL database:", error);
  }
};
