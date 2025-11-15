import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import axios from "axios";

const app = express();
const port = 3000;
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let search_results = [];

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

db.connect();

app.get("/", async (req, res) => {
    res.render("index.ejs");
})

app.get("/search", async (req, res) => {
    res.render("search.ejs");
})

app.post("/search", async (req, res) => {
    const book_name = (req.body.book_name).trim().replace(/\s+/g, '+').toLowerCase();
    try{
        const result = await axios.get(`https://openlibrary.org/search.json?q=${book_name}`);
        res.render("search.ejs", {search_results: result.data.docs});
    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});