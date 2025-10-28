const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    max: [10, 'Quantity cannot exceed 10']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    default: 0,
    min: 0
  },
  weight: {
    type: Number,
    default: 0,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: 'Please provide a valid email'
      }
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function(v) {
          return /^\+?[\d\s\-\(\)]{10,}$/.test(v);
        },
        message: 'Please provide a valid phone number'
      }
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipCode: { type: String, required: true, trim: true },
      country: { type: String, default: 'USA', trim: true }
    }
  },
  items: [orderItemSchema],
  summary: {
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalProtein: {
      type: Number,
      default: 0,
      min: 0
    },
    totalWeight: {
      type: Number,
      default: 0,
      min: 0
    },
    itemCount: {
      type: Number,
      required: true,
      min: 1
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash'
  },
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Special instructions cannot exceed 500 characters'],
    trim: true
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  orderSource: {
    type: String,
    enum: ['web', 'mobile', 'phone'],
    default: 'web'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customerInfo.email': 1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateString = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.orderNumber = `ORD-${dateString}-${randomNum}`;
  }
  next();
});

// Pre-save middleware to calculate estimated delivery time
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.estimatedDeliveryTime) {
    const now = new Date();
    const estimatedTime = new Date(now.getTime() + (this.deliveryType === 'delivery' ? 45 : 20) * 60000);
    this.estimatedDeliveryTime = estimatedTime;
  }
  next();
});

// Virtual for formatted order number
orderSchema.virtual('formattedTotal').get(function() {
  return `$${this.summary.totalPrice.toFixed(2)}`;
});

// Virtual for order age
orderSchema.virtual('orderAge').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins;
});

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get recent orders
orderSchema.statics.getRecent = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

// Instance method to mark as delivered
orderSchema.methods.markDelivered = function() {
  this.status = 'delivered';
  this.actualDeliveryTime = new Date();
  return this.save();
};

// Instance method to calculate delivery delay
orderSchema.methods.getDeliveryDelay = function() {
  if (this.actualDeliveryTime && this.estimatedDeliveryTime) {
    return Math.max(0, this.actualDeliveryTime - this.estimatedDeliveryTime) / 60000; // in minutes
  }
  return 0;
};

module.exports = mongoose.model('Order', orderSchema);