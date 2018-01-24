const pg = require("pg");

// Create the config object
const config = {
	database: process.env.DB_NAME,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST || "localhost",
	port: process.env.DB_PORT || 5432,
};

if (!config.database || !config.user || !config.password) {
	console.error("Missing database configuration:", config);
	process.exit(1);
}
// Create the shared pool object
const pool = new pg.Pool(config);

// Add a little handler for general database errors. This

pool.on("error", function(err) {
	console.error("Postgres query pool encountered an error", err);
});

// Export a simple function that just runs a query using our pool
module.exports = function(queryString, values, cb) {
	return pool.query(queryString, values, cb);
};