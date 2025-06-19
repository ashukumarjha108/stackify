const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
 //replace the link with your mongodb atlas link
mongoose.connect('mongodb+srv://ashu:raghav%40108@cluster0.lzswo7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);
 
app.use(express.json());
app.use(cors()); // Use the cors middleware
 
const productSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  price: Number,
  image: String,
});
 
const Product = mongoose.model('Product', productSchema);
 
// Function to seed initial data into the database
const seedDatabase = async () => {
  try {
    await Product.deleteMany(); // Clear existing data
 
    const products = [
      {
        name: "Men's Casual T-shirt",
        type: 'Men',
        description: 'Comfortable and stylish casual T-shirt for men',
        price: 350,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407153931/gfg-tshirts.jpg'
      },
      {
        name: 'Luxury bag',
        type: 'Not Applicable', 
        description: 'Elegant luxury bag with leather strap',
        price: 2500,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg'
      },
      {
        name: "Hoodie",
        type: 'Men',
        description: 'Light and classy hoodies for every seasons ',
        price: 450,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407153938/gfg-hoodie.jpg'
      },
      {
        name: 'Remote Control Toy car',
        type: 'Not Applicable', 
        description: 'High-quality Toy car for fun and adventure',
        price: 1200,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20240122182422/images1.jpg'
      },
      {
        name: 'Books',
        type: 'Women',
        description: 'You wll have a great time reading .',
        price: 5000,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20240110011854/reading-925589_640.jpg'
      },
      {
        name: 'Bag',
        type: 'Men', 
        description: 'Comfortable and supportive Bag ',
        price: 800,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg'
      },
      {
        name: 'Winter hoodies for women',
        type: 'Women',
        description: 'Stay cozy in style with our womens hoodie, crafted for comfort ',
        price: 250,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20230407153938/gfg-hoodie.jpg'
      },
      
      {
        name: 'Honda car ',
        type: 'Men',
        description: 'Powerful Honda car with comfy driving',
        price: 700,
        image: 
'https://media.geeksforgeeks.org/wp-content/uploads/20240122184958/images2.jpg'
      }
    ];
    
  
    
      
 
    await Product.insertMany(products);
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
 
// Seed the database on server startup
seedDatabase();
 
// Define API endpoint for fetching all products
app.get('/api/products', async (req, res) => {
  try {
    // Fetch all products from the database
    const allProducts = await Product.find();
 
    // Send the entire products array as JSON response
    res.json(allProducts);
  } catch (error) {
    console.error(error);
    res.status(500)
      .json({ error: 'Internal Server Error' });
  }
});
 
app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});