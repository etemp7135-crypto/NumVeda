require('dotenv').config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

async function test() {
  try {
    const payments = await razorpay.payments.all({ count: 10 });
    console.log("Payments found:", payments.items.length);
    if (payments.items.length > 0) {
      console.log(payments.items[0]);
    }
  } catch (err) {
    console.error(err);
  }
}

test();
