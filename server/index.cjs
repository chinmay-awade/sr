const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'chinmay',
  database: 'productdb'
});

connection.connect(err => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// Multer Storage
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

/* ---------------- 🛍 Product APIs ---------------- */

app.post('/api/products', upload.single('image'), (req, res) => {
  const { name, mainTitle, subTitle, price, mrp, rating, reviews, weight, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  
  const sql = `
    INSERT INTO products (name, mainTitle, subTitle, price, mrp, image, rating, reviews, weight, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  connection.query(sql, [name, mainTitle, subTitle, price, mrp, image, rating, reviews, weight, category], (err, result) => {
    if (err) {
      console.error('Error saving product:', err);
      return res.status(500).send('Error saving product');
    }
    
    // Return the created product with the image path
    res.send({ 
      id: result.insertId, 
      name, 
      mainTitle, 
      subTitle, 
      price, 
      mrp, 
      image, 
      rating, 
      reviews, 
      weight, 
      category 
    });
  });
});

// Modify the image column to store file paths instead of binary data
connection.query(`
  ALTER TABLE products 
  MODIFY COLUMN image VARCHAR(255) DEFAULT NULL
`, (err) => {
  if (err) {
    console.error('Error modifying products table:', err);
  } else {
    console.log('Products table updated successfully');
  }
});

app.get('/api/products', (req, res) => {
  connection.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send('Error fetching products');
    res.send(results);
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send('Error deleting product');
    res.send({ message: 'Product deleted successfully' });
  });
});

/* ---------------- 👤 Profile APIs ---------------- */

app.get('/api/profile', (req, res) => {
  connection.query('SELECT * FROM profile LIMIT 1', (err, results) => {
    if (err) return res.status(500).send('Error fetching profile');
    res.send(results[0] || {});
  });
});

app.put('/api/profile', (req, res) => {
  const { name, email, phone, address } = req.body;
  const sql = 'UPDATE profile SET name = ?, email = ?, phone = ?, address = ? WHERE id = 1';
  connection.query(sql, [name, email, phone, address], (err) => {
    if (err) return res.status(500).send('Error updating profile');
    res.send({ message: 'Profile updated successfully' });
  });
});

/* ---------------- 🌟 Customer Reviews APIs ---------------- */

// Add Review
app.post('/api/reviews', upload.single('image'), (req, res) => {
  const { name, review } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const sql = 'INSERT INTO customer_reviews (name, review, image) VALUES (?, ?, ?)';
  connection.query(sql, [name, review, image], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error adding review', error: err.message });
    res.status(200).json({ message: 'Review added successfully', id: result.insertId, image });
  });
});

// Get All Reviews
app.get('/api/reviews', (req, res) => {
  connection.query('SELECT * FROM customer_reviews', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching reviews', error: err.message });
    res.status(200).json(results);
  });
});

// Update Review
app.put('/api/reviews/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, review } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  let sql = 'UPDATE customer_reviews SET name = ?, review = ?';
  const values = [name, review];

  if (image) {
    sql += ', image = ?';
    values.push(image);
  }

  sql += ' WHERE id = ?';
  values.push(id);

  connection.query(sql, values, (err) => {
    if (err) return res.status(500).json({ message: 'Error updating review', error: err.message });
    res.status(200).json({ message: 'Review updated successfully', image });
  });
});

// Delete Review
app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  console.log('🗑 Attempting to delete review with ID:', id);

  if (!id || isNaN(id)) {
    return res.status(400).send({ message: 'Invalid review ID' });
  }

  connection.query('DELETE FROM customer_reviews WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Error deleting review:', err);
      return res.status(500).send({ message: 'Error deleting review' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'Review not found' });
    }

    res.send({ message: '✅ Review deleted successfully' });
  });
});

/* ---------------- 🖼 Banner APIs ---------------- */

// Get All Banners
app.get('/api/banners', (req, res) => {
  connection.query('SELECT * FROM banners', (err, results) => {
    if (err) {
      console.error('❌ Error fetching banners:', err);
      return res.status(500).send({ message: 'Error fetching banners' });
    }
    res.send(results);
  });
});

// Create banners table if it doesn't exist
connection.query(`
  CREATE TABLE IF NOT EXISTS banners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    title VARCHAR(255) DEFAULT 'New Banner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('❌ Error creating banners table:', err);
  } else {
    console.log('✅ Banners table created or already exists');
  }
});

// Create Banner
app.post('/api/banners', upload.single('banner'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No image file uploaded' 
      });
    }

    const image = `/uploads/${req.file.filename}`;
    const sql = 'INSERT INTO banners (image, title) VALUES (?, ?)';
    
    connection.query(sql, [image, 'New Banner'], (err, result) => {
      if (err) {
        console.error('❌ Error creating banner:', err);
        return res.status(500).json({ 
          success: false, 
          message: 'Error creating banner',
          error: err.message 
        });
      }

      res.json({ 
        success: true,
        id: result.insertId, 
        image, 
        title: 'New Banner',
        message: 'Banner created successfully' 
      });
    });
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update Banner
app.put('/api/banner/upload/:id', upload.single('banner'), (req, res) => {
  const { id } = req.params;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!image) {
    return res.status(400).send({ message: 'No image uploaded' });
  }

  connection.query(
    'UPDATE banners SET image = ? WHERE id = ?',
    [image, id],
    (err, result) => {
      if (err) {
        console.error('❌ Error updating banner:', err);
        return res.status(500).send({ message: 'Error updating banner' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).send({ message: 'Banner not found' });
      }

      res.send({ message: '✅ Banner updated successfully', image });
    }
  );
});

/* ---------------- ✅ Server Start ---------------- */

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
