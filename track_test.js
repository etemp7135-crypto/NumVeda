require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const Order = require('./models/Order');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const o = await Order.findOne({ status: 'paid' }).sort({ created_at: -1 });
  console.log("Recent Paid Order:", o);
  mongoose.disconnect();
}
check();
