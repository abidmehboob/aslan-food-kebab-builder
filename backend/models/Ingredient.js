const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true,
    maxlength: [100, 'Ingredient name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['tortilla', 'protein', 'vegetable', 'sauce', 'extra'],
    lowercase: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v) {
        return Number.isFinite(v) && v >= 0;
      },
      message: 'Price must be a valid positive number'
    }
  },
  protein: {
    type: Number,
    required: [true, 'Protein content is required'],
    min: [0, 'Protein content cannot be negative'],
    default: 0
  },
  weight: {
    type: Number,
    required: [true, 'Weight is required'],
    min: [0, 'Weight cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'fish', 'shellfish']
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0, default: 0 },
    carbs: { type: Number, min: 0, default: 0 },
    fat: { type: Number, min: 0, default: 0 },
    fiber: { type: Number, min: 0, default: 0 },
    sodium: { type: Number, min: 0, default: 0 }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  singleSelection: {
    type: Boolean,
    default: false // true for tortillas, false for add-ons
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ingredientSchema.index({ category: 1, isAvailable: 1 });
ingredientSchema.index({ name: 'text', description: 'text' });

// Virtual for price formatting
ingredientSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Static method to get ingredients by category
ingredientSchema.statics.getByCategory = function(category) {
  return this.find({ category, isAvailable: true }).sort({ name: 1 });
};

// Instance method to check if ingredient is healthy
ingredientSchema.methods.isHealthy = function() {
  return this.protein > 5 && this.nutritionalInfo.fiber > 2;
};

module.exports = mongoose.model('Ingredient', ingredientSchema);