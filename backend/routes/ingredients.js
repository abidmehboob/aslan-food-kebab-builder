const express = require('express');
const router = express.Router();

// Sample kebab ingredients with prices, images, protein content, and weight
const sampleIngredients = [
  // Tortillas (Base) - Single selection required
  { id: 20, name: 'White Flour Tortilla', category: 'tortilla', price: 0.00, description: 'Classic soft white flour tortilla', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop&crop=center', protein: 3.2, weight: 50 },
  { id: 21, name: 'Whole Wheat Tortilla', category: 'tortilla', price: 0.50, description: 'Healthy whole wheat tortilla', image: 'https://images.unsplash.com/photo-1626191466257-a9e4329fdc5c?w=200&h=150&fit=crop&crop=center', protein: 4.1, weight: 55 },
  { id: 22, name: 'Spinach Tortilla', category: 'tortilla', price: 0.75, description: 'Green spinach flavored tortilla', image: 'https://images.unsplash.com/photo-1623664788841-0c4a2e4ac2e5?w=200&h=150&fit=crop&crop=center', protein: 3.8, weight: 52 },
  { id: 23, name: 'Tomato Tortilla', category: 'tortilla', price: 0.75, description: 'Red tomato flavored tortilla', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop&crop=center', protein: 3.5, weight: 53 },

  // Proteins - High quality meat images
  { id: 1, name: 'Grilled Chicken', category: 'protein', price: 4.50, description: 'Tender grilled chicken breast strips', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=200&h=150&fit=crop&crop=center', protein: 25.4, weight: 120 },
  { id: 2, name: 'Lamb Kebab', category: 'protein', price: 6.00, description: 'Tender seasoned lamb kebab meat', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=200&h=150&fit=crop&crop=center', protein: 22.8, weight: 110 },
  { id: 3, name: 'Beef Doner', category: 'protein', price: 5.50, description: 'Slow-cooked seasoned beef doner', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&h=150&fit=crop&crop=center', protein: 24.6, weight: 115 },
  { id: 4, name: 'Mixed Grill', category: 'protein', price: 5.75, description: 'Combination of chicken and lamb', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop&crop=center', protein: 24.1, weight: 125 },
  { id: 24, name: 'Falafel', category: 'protein', price: 4.00, description: 'Crispy homemade falafel balls', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200&h=150&fit=crop&crop=center', protein: 8.5, weight: 100 },
  
  // Fresh Vegetables - Clear, appetizing images
  { id: 5, name: 'Fresh Lettuce', category: 'vegetables', price: 0.50, description: 'Crispy iceberg lettuce', image: 'https://images.unsplash.com/photo-1556909114-4f7a0cb94ac4?w=200&h=150&fit=crop&crop=center', protein: 1.2, weight: 30 },
  { id: 6, name: 'Fresh Tomatoes', category: 'vegetables', price: 0.75, description: 'Ripe sliced tomatoes', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200&h=150&fit=crop&crop=center', protein: 0.9, weight: 40 },
  { id: 7, name: 'Red Onions', category: 'vegetables', price: 0.50, description: 'Fresh sliced red onions', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200&h=150&fit=crop&crop=center', protein: 1.1, weight: 25 },
  { id: 8, name: 'Cucumbers', category: 'vegetables', price: 0.60, description: 'Fresh cucumber slices', image: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=200&h=150&fit=crop&crop=center', protein: 0.7, weight: 35 },
  { id: 9, name: 'Bell Peppers', category: 'vegetables', price: 0.80, description: 'Colorful bell pepper mix', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200&h=150&fit=crop&crop=center', protein: 1.0, weight: 45 },
  { id: 10, name: 'Pickles', category: 'vegetables', price: 0.40, description: 'Tangy dill pickles', image: 'https://images.unsplash.com/photo-1571167635670-3942fb6d4bdc?w=200&h=150&fit=crop&crop=center', protein: 0.3, weight: 20 },
  { id: 25, name: 'Jalapeños', category: 'vegetables', price: 0.60, description: 'Spicy jalapeño peppers', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop&crop=center', protein: 0.4, weight: 15 },
  
  // Premium Sauces - Clear sauce images
  { id: 11, name: 'Garlic Aioli', category: 'sauces', price: 0.30, description: 'Creamy garlic aioli sauce', image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200&h=150&fit=crop&crop=center', protein: 0.5, weight: 15 },
  { id: 12, name: 'Hot Sauce', category: 'sauces', price: 0.30, description: 'Spicy chili hot sauce', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=150&fit=crop&crop=center', protein: 0.2, weight: 12 },
  { id: 13, name: 'Tzatziki', category: 'sauces', price: 0.40, description: 'Cool cucumber yogurt sauce', image: 'https://images.unsplash.com/photo-1571197019966-4acc94ba5cd8?w=200&h=150&fit=crop&crop=center', protein: 2.1, weight: 18 },
  { id: 14, name: 'Tahini Sauce', category: 'sauces', price: 0.50, description: 'Rich sesame tahini sauce', image: 'https://images.unsplash.com/photo-1609501676725-7186f0932175?w=200&h=150&fit=crop&crop=center', protein: 5.8, weight: 20 },
  { id: 15, name: 'Hummus', category: 'sauces', price: 0.60, description: 'Smooth chickpea hummus', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=200&h=150&fit=crop&crop=center', protein: 4.9, weight: 25 },
  
  // Premium Extras - High quality add-ons
  { id: 16, name: 'Melted Cheese', category: 'extras', price: 1.00, description: 'Creamy melted cheese', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200&h=150&fit=crop&crop=center', protein: 8.2, weight: 30 },
  { id: 17, name: 'Crispy Fries', category: 'extras', price: 2.00, description: 'Golden french fries inside', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop&crop=center', protein: 2.8, weight: 80 },
  { id: 18, name: 'Grilled Halloumi', category: 'extras', price: 2.50, description: 'Grilled halloumi cheese', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200&h=150&fit=crop&crop=center', protein: 11.2, weight: 60 },
  { id: 19, name: 'Double Meat', category: 'extras', price: 3.00, description: 'Double portion of your chosen meat', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop&crop=center', protein: 15.6, weight: 100 },
  { id: 26, name: 'Avocado', category: 'extras', price: 1.50, description: 'Fresh sliced avocado', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&h=150&fit=crop&crop=center', protein: 2.0, weight: 40 },
  { id: 27, name: 'Olives', category: 'extras', price: 0.80, description: 'Mixed Mediterranean olives', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=150&fit=crop&crop=center', protein: 0.8, weight: 25 }
];

// Base kebab prices with sizes in centimeters
const basePrices = {
  small: { 
    price: 5.00, 
    length: 15, // 15cm length
    width: 4,   // 4cm diameter
    description: "Perfect for a light meal",
    weight: 180, // grams
    serves: 1
  },
  medium: { 
    price: 7.00, 
    length: 20, // 20cm length
    width: 5,   // 5cm diameter
    description: "Our most popular size",
    weight: 280, // grams
    serves: 1
  },
  large: { 
    price: 9.00, 
    length: 25, // 25cm length
    width: 6,   // 6cm diameter
    description: "For those with a hearty appetite",
    weight: 380, // grams
    serves: "1-2"
  },
  family: { 
    price: 16.00, 
    length: 35, // 35cm length
    width: 7,   // 7cm diameter
    description: "Perfect for sharing",
    weight: 650, // grams
    serves: "2-3"
  }
};

// Get all ingredients
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    
    let ingredients = sampleIngredients;
    
    if (category) {
      ingredients = sampleIngredients.filter(ingredient => 
        ingredient.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    res.json({
      success: true,
      data: {
        ingredients,
        basePrices,
        categories: ['tortilla', 'protein', 'vegetables', 'sauces', 'extras'],
        sizes: ['small', 'medium', 'large', 'family']
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ingredients',
      error: error.message
    });
  }
});

// Get ingredient by ID
router.get('/:id', (req, res) => {
  try {
    const ingredient = sampleIngredients.find(ing => ing.id === parseInt(req.params.id));
    
    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient not found'
      });
    }
    
    res.json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ingredient',
      error: error.message
    });
  }
});

// Generate kebab visual preview
router.post('/preview', (req, res) => {
  try {
    const { size, selectedIngredients } = req.body;
    
    if (!size || !selectedIngredients || !Array.isArray(selectedIngredients)) {
      return res.status(400).json({
        success: false,
        message: 'Size and selected ingredients are required'
      });
    }
    
    const sizeInfo = basePrices[size];
    if (!sizeInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid size specified'
      });
    }
    
    // Get ingredient details
    const ingredientDetails = selectedIngredients.map(ingredientId => 
      sampleIngredients.find(ing => ing.id === parseInt(ingredientId))
    ).filter(Boolean);
    
    // Calculate visual properties
    const tortilla = ingredientDetails.find(ing => ing.category === 'tortilla');
    const proteins = ingredientDetails.filter(ing => ing.category === 'protein');
    const vegetables = ingredientDetails.filter(ing => ing.category === 'vegetables');
    const sauces = ingredientDetails.filter(ing => ing.category === 'sauces');
    const extras = ingredientDetails.filter(ing => ing.category === 'extras');
    
    // Generate visual preview data
    const preview = {
      size: {
        name: size,
        dimensions: `${sizeInfo.length}cm x ${sizeInfo.width}cm`,
        length: sizeInfo.length,
        width: sizeInfo.width,
        weight: sizeInfo.weight,
        serves: sizeInfo.serves,
        description: sizeInfo.description
      },
      layers: [
        {
          type: 'base',
          name: tortilla ? tortilla.name : 'White Flour Tortilla',
          color: getTortillaColor(tortilla),
          image: tortilla ? tortilla.image : sampleIngredients.find(ing => ing.id === 20).image
        },
        ...proteins.map(protein => ({
          type: 'protein',
          name: protein.name,
          color: getProteinColor(protein),
          image: protein.image,
          coverage: getProteinCoverage(size)
        })),
        ...vegetables.map(veg => ({
          type: 'vegetable',
          name: veg.name,
          color: getVegetableColor(veg),
          image: veg.image,
          coverage: getVegetableCoverage(size)
        })),
        ...sauces.map(sauce => ({
          type: 'sauce',
          name: sauce.name,
          color: getSauceColor(sauce),
          image: sauce.image,
          coverage: getSauceCoverage(size)
        })),
        ...extras.map(extra => ({
          type: 'extra',
          name: extra.name,
          color: getExtraColor(extra),
          image: extra.image,
          coverage: getExtraCoverage(size)
        }))
      ],
      visualization: {
        svg: generateKebabSVG(size, sizeInfo, ingredientDetails),
        description: generateKebabDescription(size, sizeInfo, ingredientDetails)
      }
    };
    
    res.json({
      success: true,
      data: preview
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error generating kebab preview',
      error: error.message
    });
  }
});

// Helper functions for visual generation
function getTortillaColor(tortilla) {
  if (!tortilla) return '#F5E6D3';
  const colorMap = {
    'White Flour Tortilla': '#F5E6D3',
    'Whole Wheat Tortilla': '#D4A574',
    'Spinach Tortilla': '#9ACD32',
    'Tomato Tortilla': '#FF6347'
  };
  return colorMap[tortilla.name] || '#F5E6D3';
}

function getProteinColor(protein) {
  const colorMap = {
    'Grilled Chicken': '#DEB887',
    'Lamb Kebab': '#8B4513',
    'Beef Doner': '#A0522D',
    'Mixed Grill': '#CD853F',
    'Falafel': '#DAA520'
  };
  return colorMap[protein.name] || '#DEB887';
}

function getVegetableColor(vegetable) {
  const colorMap = {
    'Fresh Lettuce': '#90EE90',
    'Fresh Tomatoes': '#FF6347',
    'Red Onions': '#9370DB',
    'Cucumbers': '#98FB98',
    'Bell Peppers': '#FFD700',
    'Pickles': '#ADFF2F',
    'Jalapeños': '#32CD32'
  };
  return colorMap[vegetable.name] || '#90EE90';
}

function getSauceColor(sauce) {
  const colorMap = {
    'Garlic Aioli': '#F5F5DC',
    'Hot Sauce': '#FF4500',
    'Tzatziki': '#F0F8FF',
    'Tahini Sauce': '#DEB887',
    'Hummus': '#D2B48C'
  };
  return colorMap[sauce.name] || '#F5F5DC';
}

function getExtraColor(extra) {
  const colorMap = {
    'Melted Cheese': '#FFD700',
    'Crispy Fries': '#F4A460',
    'Grilled Halloumi': '#FFFACD',
    'Double Meat': '#8B4513',
    'Avocado': '#9ACD32',
    'Olives': '#2F4F4F'
  };
  return colorMap[extra.name] || '#FFD700';
}

function getProteinCoverage(size) {
  const coverage = { small: 70, medium: 75, large: 80, family: 85 };
  return coverage[size] || 75;
}

function getVegetableCoverage(size) {
  const coverage = { small: 50, medium: 60, large: 70, family: 80 };
  return coverage[size] || 60;
}

function getSauceCoverage(size) {
  const coverage = { small: 30, medium: 40, large: 50, family: 60 };
  return coverage[size] || 40;
}

function getExtraCoverage(size) {
  const coverage = { small: 40, medium: 50, large: 60, family: 70 };
  return coverage[size] || 50;
}

function generateKebabSVG(size, sizeInfo, ingredients) {
  const width = Math.min(400, sizeInfo.length * 15);
  const height = Math.min(200, sizeInfo.width * 25);
  
  let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background (plate)
  svg += `<ellipse cx="${width/2}" cy="${height-10}" rx="${width/2-10}" ry="15" fill="#E6E6FA" stroke="#D3D3D3" stroke-width="2"/>`;
  
  // Tortilla base
  const tortilla = ingredients.find(ing => ing.category === 'tortilla');
  const tortillaColor = getTortillaColor(tortilla);
  svg += `<ellipse cx="${width/2}" cy="${height/2}" rx="${width/2-20}" ry="${height/2-20}" fill="${tortillaColor}" stroke="#D2B48C" stroke-width="1"/>`;
  
  // Add ingredients layers
  let layerY = height/2;
  
  // Proteins
  const proteins = ingredients.filter(ing => ing.category === 'protein');
  proteins.forEach((protein, index) => {
    const color = getProteinColor(protein);
    const offsetX = (index - proteins.length/2) * 20;
    svg += `<ellipse cx="${width/2 + offsetX}" cy="${layerY - 5}" rx="${width/3}" ry="12" fill="${color}" opacity="0.8"/>`;
  });
  
  // Vegetables
  const vegetables = ingredients.filter(ing => ing.category === 'vegetables');
  vegetables.forEach((veg, index) => {
    const color = getVegetableColor(veg);
    const offsetX = (index - vegetables.length/2) * 15;
    svg += `<circle cx="${width/2 + offsetX}" cy="${layerY - 10}" r="8" fill="${color}" opacity="0.7"/>`;
  });
  
  // Sauces (drizzled pattern)
  const sauces = ingredients.filter(ing => ing.category === 'sauces');
  sauces.forEach((sauce, index) => {
    const color = getSauceColor(sauce);
    const y = layerY - 15 - (index * 3);
    svg += `<path d="M ${width/4} ${y} Q ${width/2} ${y-5} ${3*width/4} ${y}" stroke="${color}" stroke-width="3" fill="none" opacity="0.6"/>`;
  });
  
  // Size indicator
  svg += `<text x="10" y="20" font-family="Arial" font-size="12" fill="#333">${size.toUpperCase()} - ${sizeInfo.length}cm</text>`;
  
  svg += '</svg>';
  return svg;
}

function generateKebabDescription(size, sizeInfo, ingredients) {
  const tortilla = ingredients.find(ing => ing.category === 'tortilla');
  const proteins = ingredients.filter(ing => ing.category === 'protein');
  const vegetables = ingredients.filter(ing => ing.category === 'vegetables');
  const sauces = ingredients.filter(ing => ing.category === 'sauces');
  const extras = ingredients.filter(ing => ing.category === 'extras');
  
  let description = `${size.charAt(0).toUpperCase() + size.slice(1)} kebab (${sizeInfo.length}cm x ${sizeInfo.width}cm) featuring `;
  
  if (tortilla) {
    description += `${tortilla.name.toLowerCase()} wrapped around `;
  }
  
  if (proteins.length > 0) {
    description += `${proteins.map(p => p.name.toLowerCase()).join(' and ')}`;
  }
  
  if (vegetables.length > 0) {
    description += `, topped with ${vegetables.map(v => v.name.toLowerCase()).join(', ')}`;
  }
  
  if (sauces.length > 0) {
    description += `, drizzled with ${sauces.map(s => s.name.toLowerCase()).join(' and ')}`;
  }
  
  if (extras.length > 0) {
    description += `, enhanced with ${extras.map(e => e.name.toLowerCase()).join(' and ')}`;
  }
  
  description += `. Weighs approximately ${sizeInfo.weight}g and serves ${sizeInfo.serves}.`;
  
  return description;
}

module.exports = router;