import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "aman1234",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

//Getting all the tasks
async function getTasks() {
  items = [];
  const data = await db.query("SELECT * FROM items order by id ASC");
  items = data.rows;
  return items;
}

//Default landing page
app.get("/", async (req, res) => {
  const data = await getTasks();

  res.render("index.ejs", {
    listTitle: "Today",
    listItems: data,
  });
});

//Adding new task
app.post("/add", async (req, res) => {
  const item = req.body.newItem;

  await db.query("INSERT INTO items (title) VALUES ($1)", [item]);

  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const data = req.body.updatedItemTitle;
  const userId = req.body.updatedItemId;

  await db.query("UPDATE items SET title = ($1) WHERE id = $2", [data, userId]);

  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;

  await db.query("DELETE FROM items WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
