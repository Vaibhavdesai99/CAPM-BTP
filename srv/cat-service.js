// const { v4: uuidv4 } = require("uuid");
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
  //-----------------------------Create Coordinate post req to DB  -----------------------------
  srv.on("CREATE", "coordinates", async (req) => {
    const { data } = req;

    console.log("coordinates", data);
    try {
      const query = `INSERT INTO map_coordinates
        (id,startpoint,endpoint)
        VALUES($1, $2, $3)
        RETURNING *`;

      const values = [data.id, data.startpoint, data.endpoint];
      const result = await db.run(query, values);
      return result;
    } catch (error) {
      console.error("Error creating city", error);
      throw error;
    }
  });

  //------------------------------Read data from DB --------------------------------------------
  srv.on("READ", "coordinates", async (req) => {
    try {
      const result = await db.run(SELECT.from("map_coordinates"));
      console.log(result, "aaaaaa");
      return result;
    } catch (err) {
      console.error("Error registering user:", err);
      throw err;
    }
  });

  //--------------------------------Read data from db of pipe info --------------------------------
  srv.on("READ", "getinfo", async (req) => {
    try {
      const result = await db.run(SELECT.from("map_pipeinfo"));
      return result;
    } catch (err) {
      console.error("Error registering user:", err);
      throw err;
    }
  });
};
