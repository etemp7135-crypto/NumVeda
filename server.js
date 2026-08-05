const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const app = express();

// Rate limiting for API to prevent spam
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '')));

// Connect to MongoDB
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Define Order Schema
const orderSchema = new mongoose.Schema({
  order_id: String,
  payment_id: String,
  status: { type: String, default: 'pending' },
  amount: Number,
  currency: String,
  customer_details: { type: mongoose.Schema.Types.Mixed },
  created_at: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret456',
});

// Endpoint to create an order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt#1', customer_details } = req.body;

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);
    
    // Save to DB
    if (process.env.MONGODB_URI) {
      const newOrder = new Order({
        order_id: order.id,
        status: 'pending',
        amount,
        currency,
        customer_details
      });
      await newOrder.save();
    }
    
    res.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123'
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Could not create order' });
  }
});

// Endpoint to verify payment signature
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret456';
    
    // Create expected signature
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature is valid
      if (process.env.MONGODB_URI) {
        await Order.findOneAndUpdate(
          { order_id: razorpay_order_id },
          { status: 'paid', payment_id: razorpay_payment_id }
        ).catch(err => console.error("DB update error:", err));
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Signature is invalid
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Could not verify payment' });
  }
});

// Serve love.html for /love route
app.get('/love', (req, res) => {
  res.sendFile('love.html', { root: __dirname });
});

// Admin endpoint to view orders
app.get('/api/admin/orders', async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) return res.status(500).json({ error: 'DB not connected' });
    const orders = await Order.find().sort({ created_at: -1 });
    let html = '<h1>NumVeda Orders</h1><table border="1" cellpadding="5" cellspacing="0" style="font-family:sans-serif; text-align:left;">';
    html += '<tr><th>Date</th><th>Name</th><th>Phone</th><th>Type</th><th>Amount</th><th>Status</th><th>Order ID</th></tr>';
    orders.forEach(o => {
      const d = o.customer_details || {};
      const name = d.name || d.p1_name || 'N/A';
      const phone = d.phone || d.p1_phone || 'N/A';
      const type = d.type || 'N/A';
      const color = o.status === 'paid' ? 'lightgreen' : (o.status === 'pending' ? 'lightyellow' : 'white');
      html += `<tr style="background:${color}"><td>${new Date(o.created_at).toLocaleString('en-IN')}</td><td>${name}</td><td>${phone}</td><td>${type}</td><td>₹${o.amount}</td><td><b>${o.status.toUpperCase()}</b></td><td><small>${o.order_id}</small></td></tr>`;
    });
    html += '</table>';
    res.send(html);
  } catch(e) {
    res.status(500).send(e.toString());
  }
});
// Serve index.html for root route and all other unmatched routes (SPA fallback)
app.use((req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
