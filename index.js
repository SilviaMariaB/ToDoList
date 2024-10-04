//update idea: multiple to do lists (today/this week/this month)
//get it to work for multiple family members

import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "chimen9",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];
//var items = [];

app.get("/", async (req, res) => {
  var result = await db.query("SELECT * FROM items ORDER BY id ASC");
  var items = result.rows
  //console.log("items FROM THE 1st GET", items);
  
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  //items.push({ title: item });

  //console.log("item", item);

  try {
    var listAdded = await db.query(
      "INSERT INTO items (title) VALUES ($1)",
      [item]
    );
  //console.log("listAdded", listAdded);
  res.redirect("/");

  } catch (err) {
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {

  var updatedItId = req.body.updatedItemId
  var updatedItTitle = req.body.updatedItemTitle
 // console.log("updatedItId", updatedItId)
 // console.log("updatedItTitle", updatedItTitle)

  try {
    await db.query(
      "UPDATE items SET title = $1 WHERE id = $2",
      [updatedItTitle,updatedItId]
    );
  res.redirect("/");

  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  //console.log(req.body);
  
  var deletedItId = req.body.deleteItemId
  
 // console.log("deletedItId", deletedItId)

  try {
    await db.query(
      "DELETE FROM items WHERE id = $1",
      [deletedItId]
    );
  res.redirect("/");

  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
