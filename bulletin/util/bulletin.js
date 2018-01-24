const query = require("./query");

const Bulletin = {
	getAll: function() {
		return query("SELECT * FROM messages")
			.then(function(res) {
				console.log("All users", res.rows);
				return res.rows;
			})

		.catch(function(err) {
			console.error("Unable to get users from db", err);
		});

	},

	add: function(message) {
	return query("INSERT INTO messages (title, body) VALUES ($1, $2)", message);
	},
		
		  
	delete: function(message) {
		return query("DELETE FROM messages WHERE title = $1", [message]);
	},

	search: function(search) {
		return query("SELECT * FROM messages WHERE title LIKE $1", ["%" + search + "%"])
			.then(function(res) {
				return res.rows;
			});
	},
};

module.exports = Bulletin;