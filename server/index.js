const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ashu:raghav%40108@cluster0.lzswo7a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

// Seed Database Function
// const seedDatabase = async () => {
//   try {
//     const existingProducts = await Product.countDocuments();
    
//     if (existingProducts > 0) {
//       console.log('📦 Database already has products, skipping seed...');
//       return;
//     }

//     const products = [
//       {
//         name: "Men's Casual T-shirt",
//         type: 'Men',
//         description: 'Comfortable and stylish casual T-shirt for men. Perfect for everyday wear with premium cotton fabric.',
//         price: 350,
//         image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407153931/gfg-tshirts.jpg'
//       },
//       {
//         name: 'Luxury Handbag',
//         type: 'Women', 
//         description: 'Elegant luxury handbag with genuine leather strap. Perfect accessory for any occasion.',
//         price: 2500,
//         image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg'
//       },
//       {
//         name: "Men's Hoodie",
//         type: 'Men',
//         description: 'Light and classy hoodies for every season. Made with soft cotton blend for maximum comfort.',
//         price: 450,
//         image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407153938/gfg-hoodie.jpg'
//       },
//       {
//         name: 'Remote Control Toy Car',
//         type: 'Kids', 
//         description: 'High-quality remote control toy car for fun and adventure. Perfect gift for children.',
//         price: 1200,
//         image: 'https://media.geeksforgeeks.org/wp-content/uploads/20240122182422/images1.jpg'
//       },
//       {
//         name: 'Programming Books Set',
//         type: 'Books',
//         description: 'Collection of programming books. You will have a great time learning and expanding your knowledge.',
//         price: 5000,
//         image: 'https://media.geeksforgeeks.org/wp-content/uploads/20240110011854/reading-925589_640.jpg'
//       },
//       {
//         name: 'Travel Backpack',
//         type: 'Unisex', 
//         description: 'Comfortable and supportive travel backpack. Perfect for hiking and daily commute.',
//         price: 800,
//         image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407154213/gfg-bag.jpg'
//       },
//       {
//         name: 'Winter Hoodies for Women',
//         type: 'Women',
//         description: 'Stay cozy in style with our womens hoodie, crafted for comfort and warmth during winter.',
//         price: 250,
//         image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230407153938/gfg-hoodie.jpg'
//       },
//       {
//         name: 'Honda Model Car',
//         type: 'Collectibles',
//         description: 'Detailed Honda model car replica. Perfect collectible for car enthusiasts.',
//         price: 700,
//         image: 'https://media.geeksforgeeks.org/wp-content/uploads/20240122184958/images2.jpg'
//       }
//     ];

//     await Product.insertMany(products);
//     console.log('🌱 Database seeded successfully with', products.length, 'products');
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//   }
// };

const axios = require('axios');

const seedDatabase = async () => {
  try {
    console.log('🌐 Fetching products from DummyJSON API...');
    const response = await axios.get('https://dummyjson.com/products?limit=100');
    const products = response.data.products;

    await Product.deleteMany({}); // optional: start fresh

    const formattedProducts = products.map(p => ({
      name: p.title,
      type: p.category,
      description: p.description,
      price: p.price,
      image: p.thumbnail || p.images?.[0] || ''
    }));

    await Product.insertMany(formattedProducts);
    console.log(`🌱 Seeded ${formattedProducts.length} products from DummyJSON`);
  } catch (error) {
    console.error('❌ Error seeding:', error);
  }
};



// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: '🛒 Ecommerce API Server is running!',
    version: '1.0.0',
    endpoints: {
      products: '/api/products',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, search } = req.query;
    let filter = {};
    
    // Add filters if provided
    if (type && type !== 'all') {
      filter.type = new RegExp(type, 'i');
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to fetch products'
    });
  }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal Server Error' 
    });
  }
});

// Add new product (bonus endpoint)
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    
    res.status(201).json({
      success: true,
      data: savedProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('❌ Error creating product:', error);
    res.status(400).json({ 
      success: false,
      error: 'Bad Request',
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server and seed database
const startServer = async () => {
  try {
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
      console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('📦 Database connection closed');
  process.exit(0);
});