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

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})

db.connect();

app.get("/", async (req, res) => {
    try{
        const response = await db.query("SELECT * FROM recenzija_knjige");
        if(response.rows.length != 0){
            res.render("index.ejs", {reviews: response.rows}); 
        } else {
            res.render("index.ejs");
        }
    } catch (err){
        console.log(err);
    }
    
})

app.get("/search", async (req, res) => {
    res.render("search.ejs");
})

app.post("/reviews", (req, res) => {
    res.render("reviews.ejs", { book_data: req.body });
});

app.post("/reviews/save", async (req, res) => {
    const { title, author, publish_year, cover_id, key, review, rating } = req.body;
    await db.query(
        "INSERT INTO recenzija_knjige (book_title, book_author, book_publish_year, review_text, rating, cover_url, book_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [title, author, publish_year, review, rating, cover_id, key]
    );

    res.redirect("/");
});

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