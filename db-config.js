// db-config.js
module.exports = {
  user: "postgres",
  host: "localhost",
  port: 5432,
  database: "postgres",
  password: "123456789",
  // port: "3120",
  // Add more options as needed
  connectionTimeoutMillis: 5000, // Example: 5 seconds
  idleTimeoutMillis: 30000, // Example: 30 seconds
};
