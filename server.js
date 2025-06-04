import express from 'express';
import router from './routes/new.js';
import pg from 'pg';


const app = express();
const PORT = process.env.PORT || 3000;
const db1 = new pg.Client({

  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "Imanewman1!",
  port: 5432,

});

db1.connect()
  .then(() => console.log("Connected to the database"))


// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

//public directory
app.use(express.static('public'));


// Middleware to parse JSON data
app.use(express.json());


// Use router for handling new note routes
app.use('/new', (req, res, next) => {
    req.db = db1;  
    next();
}, router);


app.get('/', async (req, res) => {

    const result = await db1.query('SELECT * FROM books');
    const books = result.rows;
    res.render('index.ejs', {
        
        books: books
    });
});

app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db1.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.render('books.ejs', { book: result.rows[0] });
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.get('/books/:id/edit', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db1.query('SELECT * FROM books WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send('Book not found');
        }
        res.render('edit.ejs', { book: result.rows[0] });
    } catch (error) {
        console.error('Error fetching book:', error);
        return res.status(500).send('Internal Server Error');
    }
});

app.post('/books/:id', async (req, res) => {
    const { id } = req.params;
    const { title, author, description, olid } = req.body;  
    try {
        const result = await db1.query(
            'UPDATE books SET title = $1, author = $2, description = $3, olid = $4 WHERE id = $5',
            [title, author, description, olid, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).send('Book not found');
        }
        res.redirect(`/books/${id}`);
    } catch (error) {
        console.error('Error updating book:', error);
        return res.status(500).send('Internal Server Error');
    }
});
// Route to delete a book

app.post('/books/:id/delete', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db1.query('DELETE FROM books WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).send('Book not found');
        }
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting book:', error);
        return res.status(500).send('Internal Server Error');
    }
});



app.get('/aboutme', (req, res) => {
    res.render('aboutme.ejs');

});
 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
