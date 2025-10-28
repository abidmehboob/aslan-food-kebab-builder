const express = require('express');
const router = express.Router();

// Import ingredients data (in a real app, this would come from a database)
const sampleIngredients = [
  // Tortillas (Base)
  { id: 20, name: 'White Flour Tortilla', category: 'tortilla', price: 0.00, description: 'Classic soft white flour tortilla', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop', protein: 3.2, weight: 50 },
  { id: 21, name: 'Whole Wheat Tortilla', category: 'tortilla', price: 0.50, description: 'Healthy whole wheat tortilla', image: 'https://images.unsplash.com/photo-1626191466257-a9e4329fdc5c?w=200&h=150&fit=crop', protein: 4.1, weight: 55 },
  { id: 22, name: 'Spinach Tortilla', category: 'tortilla', price: 0.75, description: 'Green spinach flavored tortilla', image: 'https://images.unsplash.com/photo-1623664788841-0c4a2e4ac2e5?w=200&h=150&fit=crop', protein: 3.8, weight: 52 },
  { id: 23, name: 'Tomato Tortilla', category: 'tortilla', price: 0.75, description: 'Red tomato tortilla', image: 'https://images.unsplash.com/photo-1615842974426-55c372fd8d8b?w=200&h=150&fit=crop', protein: 3.5, weight: 53 },

  // Proteins
  { id: 1, name: 'Chicken Breast', category: 'protein', price: 4.50, description: 'Grilled chicken breast strips', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=150&fit=crop', protein: 25.4, weight: 120 },
  { id: 2, name: 'Lamb Meat', category: 'protein', price: 6.00, description: 'Tender lamb kebab meat', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=150&fit=crop', protein: 22.8, weight: 110 },
  { id: 3, name: 'Beef Kebab', category: 'protein', price: 5.50, description: 'Seasoned beef kebab', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=150&fit=crop', protein: 24.6, weight: 115 },
  { id: 4, name: 'Mixed Meat', category: 'protein', price: 5.75, description: 'Chicken and lamb mix', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop', protein: 24.1, weight: 125 },
  
  // Vegetables
  { id: 5, name: 'Lettuce', category: 'vegetables', price: 0.50, description: 'Fresh crispy lettuce', image: 'https://images.unsplash.com/photo-1556909114-4f7a0cb94ac4?w=200&h=150&fit=crop', protein: 1.2, weight: 30 },
  { id: 6, name: 'Tomatoes', category: 'vegetables', price: 0.75, description: 'Fresh sliced tomatoes', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&h=150&fit=crop', protein: 0.9, weight: 40 },
  { id: 7, name: 'Onions', category: 'vegetables', price: 0.50, description: 'Red onions', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=150&fit=crop', protein: 1.1, weight: 25 },
  { id: 8, name: 'Cucumbers', category: 'vegetables', price: 0.60, description: 'Fresh cucumbers', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=200&h=150&fit=crop', protein: 0.7, weight: 35 },
  { id: 9, name: 'Peppers', category: 'vegetables', price: 0.80, description: 'Mixed bell peppers', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=150&fit=crop', protein: 1.0, weight: 45 },
  { id: 10, name: 'Pickles', category: 'vegetables', price: 0.40, description: 'Tangy pickles', image: 'https://images.unsplash.com/photo-1571167635670-3942fb6d4bdc?w=200&h=150&fit=crop', protein: 0.3, weight: 20 },
  
  // Sauces
  { id: 11, name: 'Garlic Sauce', category: 'sauces', price: 0.30, description: 'Creamy garlic sauce', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200&h=150&fit=crop', protein: 0.5, weight: 15 },
  { id: 12, name: 'Chili Sauce', category: 'sauces', price: 0.30, description: 'Spicy chili sauce', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop', protein: 0.2, weight: 12 },
  { id: 13, name: 'Yogurt Sauce', category: 'sauces', price: 0.40, description: 'Cool yogurt sauce', image: 'https://images.unsplash.com/photo-1571197019966-4acc94ba5cd8?w=200&h=150&fit=crop', protein: 2.1, weight: 18 },
  { id: 14, name: 'Tahini', category: 'sauces', price: 0.50, description: 'Sesame tahini sauce', image: 'https://images.unsplash.com/photo-1609501676725-7186f0932175?w=200&h=150&fit=crop', protein: 5.8, weight: 20 },
  { id: 15, name: 'Hummus', category: 'sauces', price: 0.60, description: 'Creamy hummus', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=200&h=150&fit=crop', protein: 4.9, weight: 25 },
  
  // Extras
  { id: 16, name: 'Extra Cheese', category: 'extras', price: 1.00, description: 'Melted cheese', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=150&fit=crop', protein: 8.2, weight: 30 },
  { id: 17, name: 'French Fries', category: 'extras', price: 2.00, description: 'Crispy fries inside', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop', protein: 2.8, weight: 80 },
  { id: 18, name: 'Grilled Halloumi', category: 'extras', price: 2.50, description: 'Grilled halloumi cheese', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&h=150&fit=crop', protein: 11.2, weight: 60 },
  { id: 19, name: 'Extra Meat', category: 'extras', price: 3.00, description: 'Double portion of meat', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop', protein: 15.6, weight: 100 }
];

const basePrices = {
  small: {
    price: 5.00,
    length: 15,
    width: 4,
    weight: 150,
    serves: 1,
    description: 'Perfect for a light meal or snack'
  },
  medium: {
    price: 7.00,
    length: 20,
    width: 5,
    weight: 250,
    serves: '1-2',
    description: 'Our most popular size, great for lunch'
  },
  large: {
    price: 9.00,
    length: 25,
    width: 6,
    weight: 350,
    serves: '2-3',
    description: 'Hearty portion perfect for dinner'
  },
  family: {
    price: 14.00,
    length: 35,
    width: 8,
    weight: 600,
    serves: '3-4',
    description: 'Our largest kebab, great for sharing'
  }
};

// Get builder configuration
router.get('/config', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        basePrices,
        ingredientCategories: ['tortilla', 'protein', 'vegetables', 'sauces', 'extras'],
        sizes: ['small', 'medium', 'large', 'family'],
        ingredients: sampleIngredients
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching builder configuration',
      error: error.message
    });
  }
});

// Calculate kebab price
router.post('/calculate', (req, res) => {
  try {
    const { size, selectedIngredients } = req.body;
    
    if (!size || !basePrices[size]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size specified'
      });
    }
    
    const sizeInfo = basePrices[size];
    let basePrice = typeof sizeInfo === 'object' ? sizeInfo.price : sizeInfo;
    let ingredientsPrice = 0;
    let totalProtein = 0;
    let totalWeight = 0;
    let kebabIngredients = [];
    
    if (selectedIngredients && Array.isArray(selectedIngredients)) {
      selectedIngredients.forEach(ingredientId => {
        const ingredient = sampleIngredients.find(ing => ing.id === ingredientId);
        if (ingredient) {
          ingredientsPrice += ingredient.price;
          totalProtein += ingredient.protein;
          totalWeight += ingredient.weight;
          kebabIngredients.push(ingredient);
        }
      });
    }
    
    const totalPrice = basePrice + ingredientsPrice;
    
    res.json({
      success: true,
      data: {
        size,
        basePrice,
        ingredientsPrice,
        totalPrice: Number(totalPrice.toFixed(2)),
        totalProtein: Number(totalProtein.toFixed(1)),
        totalWeight: Number(totalWeight.toFixed(0)),
        selectedIngredients: kebabIngredients,
        breakdown: {
          base: `${size} kebab: $${basePrice.toFixed(2)}`,
          ingredients: `Ingredients: $${ingredientsPrice.toFixed(2)}`,
          total: `Total: $${totalPrice.toFixed(2)}`,
          protein: `Total Protein: ${totalProtein.toFixed(1)}g`,
          weight: `Total Weight: ${totalWeight}g`
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating kebab price',
      error: error.message
    });
  }
});

// Create custom kebab order
router.post('/create', (req, res) => {
  try {
    const { size, selectedIngredients, customerName, specialInstructions } = req.body;
    
    if (!size || !basePrices[size]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size specified'
      });
    }
    
    const sizeInfo = basePrices[size];
    let basePrice = typeof sizeInfo === 'object' ? sizeInfo.price : sizeInfo;
    let ingredientsPrice = 0;
    let totalProtein = 0;
    let totalWeight = 0;
    let kebabIngredients = [];
    
    if (selectedIngredients && Array.isArray(selectedIngredients)) {
      selectedIngredients.forEach(ingredientId => {
        const ingredient = sampleIngredients.find(ing => ing.id === ingredientId);
        if (ingredient) {
          ingredientsPrice += ingredient.price;
          totalProtein += ingredient.protein;
          totalWeight += ingredient.weight;
          kebabIngredients.push(ingredient);
        }
      });
    }
    
    const totalPrice = basePrice + ingredientsPrice;
    const orderId = 'KB' + Date.now(); // Simple order ID generation
    
    const kebabOrder = {
      orderId,
      customerName: customerName || 'Guest',
      size,
      ingredients: kebabIngredients,
      specialInstructions: specialInstructions || '',
      pricing: {
        basePrice,
        ingredientsPrice,
        totalPrice: Number(totalPrice.toFixed(2))
      },
      nutrition: {
        totalProtein: Number(totalProtein.toFixed(1)),
        totalWeight: Number(totalWeight.toFixed(0))
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      message: 'Kebab order created successfully',
      data: kebabOrder
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating kebab order',
      error: error.message
    });
  }
});

// Get popular combinations
router.get('/popular', (req, res) => {
  try {
    const popularCombos = [
      {
        id: 1,
        name: 'Classic Chicken Kebab',
        size: 'medium',
        ingredients: [1, 5, 6, 7, 11, 13], // Chicken, lettuce, tomatoes, onions, garlic sauce, yogurt sauce
        description: 'Our most popular chicken kebab with fresh vegetables and creamy sauces',
        estimatedPrice: 9.85
      },
      {
        id: 2,
        name: 'Spicy Lamb Special',
        size: 'large',
        ingredients: [2, 5, 6, 9, 12, 14], // Lamb, lettuce, tomatoes, peppers, chili sauce, tahini
        description: 'For those who like it hot! Lamb with spicy peppers and chili sauce',
        estimatedPrice: 13.15
      },
      {
        id: 3,
        name: 'Vegetarian Delight',
        size: 'medium',
        ingredients: [5, 6, 7, 8, 9, 15, 18], // All veggies + hummus + halloumi
        description: 'Perfect for vegetarians with grilled halloumi and fresh vegetables',
        estimatedPrice: 12.75
      },
      {
        id: 4,
        name: 'Meat Lovers',
        size: 'large',
        ingredients: [4, 6, 7, 11, 16, 19], // Mixed meat, tomatoes, onions, garlic sauce, cheese, extra meat
        description: 'Double meat portion with cheese for the ultimate protein experience',
        estimatedPrice: 17.25
      }
    ];
    
    res.json({
      success: true,
      data: popularCombos
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching popular combinations',
      error: error.message
    });
  }
});

module.exports = router;