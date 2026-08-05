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
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(express.static(path.join(__dirname, '')));

// Connect to MongoDB (Serverless pattern)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // fail fast if IP is blocked
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
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
    await connectDB();
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
      await connectDB();
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

// Razorpay Webhook for background confirmation
app.post('/api/webhook/razorpay', async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'numvedawebhook2026';
    const signature = req.headers['x-razorpay-signature'];
    
    // Use rawBody to ensure exact byte match for signature
    const expectedSignature = crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
    
    if (expectedSignature === signature) {
      const event = req.body.event;
      if (event === 'payment.captured' || event === 'payment.authorized') {
        const payment = req.body.payload.payment.entity;
        await connectDB();
        if (process.env.MONGODB_URI) {
          await Order.findOneAndUpdate(
            { order_id: payment.order_id },
            { status: 'paid', payment_id: payment.id }
          );
        }
      }
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Endpoint to track/recover report by phone number
app.post('/api/track-report', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });
    
    // Clean phone number (keep only digits)
    let cleanPhone = phone.replace(/\D/g, '');
    // If it starts with 91 and is 12 digits, take last 10
    if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(-10);
    } else if (cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(-10);
    }
    
    await connectDB();
    if (!process.env.MONGODB_URI) return res.status(500).json({ error: 'DB not connected' });
    
    // Find the most recent paid order containing these 10 digits
    const order = await Order.findOne({ 
      'customer_details.phone': { $regex: cleanPhone },
      status: 'paid'
    }).sort({ created_at: -1 });
    
    if (order) {
      res.json({ success: true, order });
    } else {
      res.json({ success: false, message: 'No paid report found for this number' });
    }
  } catch(e) {
    res.status(500).json({ error: 'Server error tracking report' });
  }
});

// Serve love.html for /love route
app.get('/love', (req, res) => {
  res.sendFile('love.html', { root: __dirname });
});


// Serve index.html for root route and all other unmatched routes (SPA fallback)
app.use((req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
