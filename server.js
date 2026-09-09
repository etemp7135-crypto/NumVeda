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
  max: 200, // Limit each IP to 200 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));
app.use(express.urlencoded({ extended: true }));
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

// Define Event Schema for funnel tracking
const eventSchema = new mongoose.Schema({
  session_id: { type: String, index: true },
  event_name: { type: String, index: true },
  timestamp: { type: Date, default: Date.now, index: true },
  question_id: String,
  answer_value: String,
  category: String,
  step_number: Number,
  report_type: String,
  amount: Number,
  order_id: String,
  payment_id: String,
  utm_source: String,
  utm_medium: String,
  utm_campaign: String,
  referrer: String,
  device_type: String,
}, { collection: 'events' });
const Event = mongoose.model('Event', eventSchema);

// Define Session Schema for funnel tracking
const sessionSchema = new mongoose.Schema({
  session_id: { type: String, unique: true, index: true },
  started_at: { type: Date, default: Date.now, index: true },
  last_active: { type: Date, default: Date.now },
  utm_source: String,
  device_type: String,
  events: [String],
  category_selected: String,
  current_step: Number,
}, { collection: 'sessions' });
const Session = mongoose.model('Session', sessionSchema);

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykey123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecret456',
});

// Endpoint for analytics tracking
app.post('/api/track', async (req, res) => {
  try {
    const data = req.body;
    if (!data.session_id || !data.event) return res.status(400).json({ error: 'Missing session_id or event' });

    await connectDB();
    if (!process.env.MONGODB_URI) return res.json({ success: true, simulated: true });

    const newEvent = new Event({
      session_id: data.session_id,
      event_name: data.event,
      timestamp: new Date(),
      question_id: data.question_id,
      answer_value: data.answer,
      category: data.category,
      step_number: data.step,
      amount: data.amount,
      order_id: data.order_id,
      payment_id: data.payment_id,
      report_type: data.report_type,
      utm_source: data.utm_source,
      device_type: data.device_type,
      referrer: data.referrer,
    });
    await newEvent.save();

    // Update Session
    await Session.findOneAndUpdate(
      { session_id: data.session_id },
      { 
        $set: { last_active: new Date() },
        $setOnInsert: { 
          started_at: new Date(),
          utm_source: data.utm_source,
          device_type: data.device_type,
        },
        $push: { events: data.event },
        ...(data.category ? { category_selected: data.category } : {}),
        ...(data.step ? { current_step: data.step } : {})
      },
      { upsert: true, new: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Tracking error:', err);
    res.status(500).json({ success: false });
  }
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

// Endpoint for Razorpay callback_url (handles form POST)
app.post('/api/payment-callback', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const { type } = req.query; // 'base' or 'pro'
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.redirect('/?payment=failed');
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummysecret456';
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Valid payment
      await connectDB();
      if (process.env.MONGODB_URI) {
        await Order.findOneAndUpdate(
          { order_id: razorpay_order_id },
          { status: 'paid', payment_id: razorpay_payment_id }
        ).catch(err => console.error("DB update error:", err));
      }
      return res.redirect(`/?payment=success&type=${type || 'base'}&order_id=${razorpay_order_id}`);
    } else {
      return res.redirect('/?payment=failed');
    }
  } catch (error) {
    console.error('Error in payment callback:', error);
    return res.redirect('/?payment=failed');
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

// Endpoint to generate invoice data by phone number (admin use)
app.post('/api/get-invoice', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });

    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length > 10 && cleanPhone.startsWith('91')) {
      cleanPhone = cleanPhone.slice(-10);
    } else if (cleanPhone.length > 10) {
      cleanPhone = cleanPhone.slice(-10);
    }

    await connectDB();
    if (!process.env.MONGODB_URI) return res.status(500).json({ error: 'DB not connected' });

    // Find all paid orders for this phone (latest first)
    const orders = await Order.find({
      'customer_details.phone': { $regex: cleanPhone },
      status: 'paid'
    }).sort({ created_at: -1 });

    if (!orders || orders.length === 0) {
      return res.json({ success: false, message: 'No paid order found for this number' });
    }

    // Map to invoice-friendly format
    const invoices = orders.map((order, idx) => {
      const cd = order.customer_details || {};
      const reportType = cd.type === 'ultimate' ? 'Ultimate Blueprint Report (Pro)' : 'NumVeda Master Report (Base)';
      const invoiceNumber = 'NV-' + (order.order_id || '').replace('order_', '').toUpperCase().slice(0, 10);
      return {
        invoice_number: invoiceNumber,
        order_id: order.order_id,
        payment_id: order.payment_id,
        date: order.created_at,
        customer_name: cd.name || 'N/A',
        customer_phone: cd.phone || cleanPhone,
        customer_dob: cd.dob || 'N/A',
        customer_gender: cd.gender || 'N/A',
        report_type: reportType,
        amount: order.amount,
        currency: order.currency || 'INR',
        status: order.status,
      };
    });

    res.json({ success: true, invoices });
  } catch (err) {
    console.error('Invoice fetch error:', err);
    res.status(500).json({ error: 'Server error fetching invoice' });
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



// Serve index.html for root route and all other unmatched routes (SPA fallback)
app.use((req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
