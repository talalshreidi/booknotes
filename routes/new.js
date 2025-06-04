import express from "express"; 

const router = express.Router();

// Route to render the new note form
router.get("/", (req, res) => {
  res.render("new.ejs"); 
});



// Route to handle form submission

router.post('/books', async (req, res) => {
  
  const { title, author, description, olid } = req.body;
  const db = req.db;  
  try {

    
    const result = await db.query( 
      'INSERT INTO books (title, author, description, olid) VALUES ($1, $2, $3, $4)',
      [title, author, description, olid]
    );
    res.redirect('/');  

  } catch (error) {
    console.error('Error inserting book:', error);
    return res.status(500).send('Internal Server Error');
  }

});

router.get('/books/:id', async (req, res) => {
  const db = req.db;
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.render('book.ejs', { book: result.rows[0] });
  } catch (error) {
    console.error('Error fetching book:', error);
    return res.status(500).send('Internal Server Error');
  }
});



// Export the router

export default router;