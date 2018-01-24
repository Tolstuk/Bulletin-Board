require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Bulletin = require("./util/bulletin");
// Set the default view engine to EJS, which means
// we don't have to specify ".ejs" in render paths
app.set("view engine", "ejs");
// Configure your app to correctly interpret POST
// request bodies. The urlencoded one handles HTML
// <form> POSTs. The json one handles jQuery POSTs.
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// Setup the public assets to live in the assets folder
app.use(express.static("assets"));

function renderMessages(res, message) {
	Bulletin.getAll()
		.then(function(title, body) {
			res.render("bulletin", {
				title: title,
				// body
				message: message,

			});
		});
}


app.get("/", function(req, res) {
	renderMessages(res);
});


app.post("/", function(req, res) {
	if (req.body.title === "") {
		res.redirect("/add?msg=please%20enter%20title&tt=&bd=" + req.body.body);
	return;
	}
	else if (req.body.body === "") {
		res.redirect("/add?msg=please%20enter%20body&bd=&tt=" + req.body.title);
	return;
	}
	Bulletin.add([req.body.title, req.body.body])
		.then(function() {
			renderMessages(res, "Saved " + req.body.title);

		})
		.catch(function(err) {
			console.error(err);
		});

});

app.get("/add", function(req, res) {
	// res.json(req.query)
   console.log(req);
	res.render("add", {
				tt: req.query.tt,
				bd: req.query.bd,
				msg: req.query.msg,

			})
});



app.get("/delete", function(req, res) {
	Bulletin.delete(req.query.delete).then(function() {
		renderMessages(res, "Delete " + req.query.delete);
	});
});

app.get("/search", function(req, res) {
	Bulletin.search(req.query.search)
		.then(function(title) {
			res.render("search", {
				title: title,
				message: null,

			});
		});
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
	console.log("Listening at http://localhost:" + port);
});