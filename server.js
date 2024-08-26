const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Connect to MongoDB
MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        db = client.db('RQ_Analytics'); // Specify the database name
        console.log('MongoDB connected to RQ_Analytics');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// API endpoints for each collection

// Get all customers
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await db.collection('shopifyCustomers').find().toArray();
        console.log('Customers found:', customers.length); // Log the number of customers found
        if (customers.length === 0) {
            console.log('No customers found in the database.');
        }
        res.json(customers);
    } catch (err) {
        console.error('Error fetching customers:', err); // Log any errors
        res.status(500).json({ message: err.message });
    }
});

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.collection('shopifyProducts').find().toArray();
        console.log('Products found:', products.length); // Log the number of products found
        if (products.length === 0) {
            console.log('No products found in the database.');
        }
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err); // Log any errors
        res.status(500).json({ message: err.message });
    }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await db.collection('shopifyOrders').find().toArray();
        console.log('Orders found:', orders.length); // Log the number of orders found
        if (orders.length === 0) {
            console.log('No orders found in the database.');
        }
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err); // Log any errors
        res.status(500).json({ message: err.message });
    }
});


// Assuming you're using Express and Mongoose
app.get('/api/orders/sales-over-time', async (req, res) => {
    const interval = req.query.interval || 'daily'; // 'daily', 'monthly', 'quarterly', 'yearly'

    try {
        const pipeline = [
            {
                $project: {
                    total_price: { $toDouble: "$total_price_set.shop_money.amount" }, // Convert to number
                    created_at: "$created_at"
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$created_at" },
                        month: { $month: "$created_at" },
                        day: { $dayOfMonth: "$created_at" },
                        quarter: { $concat: [
                            { $toString: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } } }
                        ] },
                    },
                    totalSales: { $sum: "$total_price" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $dateToString: {
                            format: (interval === 'daily') ? "%Y-%m-%d" :
                                    (interval === 'monthly') ? "%Y-%m" :
                                    (interval === 'quarterly') ? "%Y-Q%q" :
                                    "%Y-%m",
                            date: {
                                $dateFromParts: {
                                    year: "$_id.year",
                                    month: (interval === 'quarterly') ? 1 : "$_id.month",
                                    day: (interval === 'daily') ? "$_id.day" : 1
                                }
                            }
                        }
                    },
                    totalSales: 1
                }
            },
            { $sort: { date: 1 } }
        ];

        const salesData = await db.collection(shopifyOrders).aggregate(pipeline);
        res.json(salesData);
    } catch (error) {
        console.error('Error fetching sales data:', error);
        res.status(500).json({ message: error.message });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
