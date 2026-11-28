import mongoose from 'mongoose';
import priceSchema from './price.schema.js';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true,
        },
        variant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product.variants',
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: priceSchema,
          required: true,
        },
      },
    ],
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    totalPrice: {
      type: priceSchema,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const orderModel = mongoose.model('order', orderSchema);

export default orderModel;