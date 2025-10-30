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

// AI Image Generation endpoint
router.post('/generate-images', async (req, res) => {
  try {
    const { openKebabPrompt, wrappedKebabPrompt, kebabData, openKebabPromptCompact, wrappedKebabPromptCompact } = req.body;

    // Validate input
    if (!openKebabPrompt || !wrappedKebabPrompt || !kebabData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters for image generation'
      });
    }

    // Log the generation request
    console.log('🎨 AI Image Generation Request:', {
      size: kebabData.size,
      ingredients: kebabData.ingredients,
      measurements: kebabData.measurements,
      timestamp: new Date().toISOString()
    });

    // Reduced AI generation simulation delay for faster response
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate images with both detailed and compact prompts
    const requestData = {
      openKebabPromptCompact,
      wrappedKebabPromptCompact
    };
    const generatedImages = await generateKebabImages(openKebabPrompt, wrappedKebabPrompt, kebabData, requestData);

    res.json({
      success: true,
      message: 'Images generated successfully',
      data: generatedImages,
      metadata: {
        generatedAt: new Date().toISOString(),
        prompts: {
          openKebab: openKebabPrompt,
          wrappedKebab: wrappedKebabPrompt
        },
        kebabSpecs: kebabData
      }
    });

  } catch (error) {
    console.error('Error generating AI images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI images',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * Generate kebab images using FREE AI services
 * Multiple free options with fallbacks
 */
async function generateKebabImages(openPrompt, wrappedPrompt, kebabData, requestData = {}) {
  try {
    // Try multiple free AI services in order of preference
    const services = [
      'huggingface-free',
      'pollinations-free', 
      'craiyon-free',
      'svg-fallback'
    ];

    for (const service of services) {
      try {
        const result = await generateWithService(service, openPrompt, wrappedPrompt, kebabData, requestData);
        if (result) {
          return result;
        }
      } catch (error) {
        console.log(`❌ Service ${service} failed:`, error.message);
        
        // Handle rate limiting specifically
        if (error.message.includes('rate limit') || error.message.includes('Too many requests')) {
          console.log(`⏰ Rate limited on ${service}, trying next service...`);
        }
        continue;
      }
    }

    // Fallback to high-quality SVG if all services fail
    return generateSVGFallback(kebabData);

  } catch (error) {
    console.error('All AI services failed, using SVG fallback:', error);
    return generateSVGFallback(kebabData);
  }
}

/**
 * Generate images with specific free AI service
 */
async function generateWithService(service, openPrompt, wrappedPrompt, kebabData, requestData = {}) {
  switch (service) {
    case 'huggingface-free':
      return await generateWithHuggingFace(openPrompt, wrappedPrompt, kebabData);
    
    case 'pollinations-free':
      return await generateWithPollinations(openPrompt, wrappedPrompt, kebabData, requestData);
    
    case 'craiyon-free':
      return await generateWithCraiyon(openPrompt, wrappedPrompt, kebabData);
    
    case 'svg-fallback':
      return generateSVGFallback(kebabData);
    
    default:
      throw new Error(`Unknown service: ${service}`);
  }
}

/**
 * FREE Hugging Face Inference API (No API key needed for some models)
 */
async function generateWithHuggingFace(openPrompt, wrappedPrompt, kebabData) {
  try {
    const baseUrl = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
    
    // Generate open kebab image
    let openImageUrl;
    try {
      const openResponse = await fetch(baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: openPrompt,
          parameters: {
            negative_prompt: "blurry, low quality, distorted",
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        }),
        timeout: 3000 // Fast 3-second timeout for HuggingFace
      });

      if (openResponse.ok) {
        const openBlob = await openResponse.arrayBuffer();
        openImageUrl = `data:image/jpeg;base64,${Buffer.from(openBlob).toString('base64')}`;
      }
    } catch (error) {
      console.log('HuggingFace open image failed:', error.message);
    }

    // Generate wrapped kebab image
    let wrappedImageUrl;
    try {
      const wrappedResponse = await fetch(baseUrl, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: wrappedPrompt,
          parameters: {
            negative_prompt: "blurry, low quality, distorted",
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        }),
        timeout: 3000 // Fast 3-second timeout for HuggingFace
      });

      if (wrappedResponse.ok) {
        const wrappedBlob = await wrappedResponse.arrayBuffer();
        wrappedImageUrl = `data:image/jpeg;base64,${Buffer.from(wrappedBlob).toString('base64')}`;
      }
    } catch (error) {
      console.log('HuggingFace wrapped image failed:', error.message);
    }

    // Return if at least one image was generated
    if (openImageUrl || wrappedImageUrl) {
      return {
        openKebabImage: openImageUrl || generatePlaceholderImageUrl('open-kebab', kebabData),
        wrappedKebabImage: wrappedImageUrl || generatePlaceholderImageUrl('wrapped-kebab', kebabData),
        metadata: {
          generationTime: '15-30s',
          model: 'stable-diffusion-v1-5',
          resolution: '512x512',
          style: 'AI-generated',
          service: 'HuggingFace (Free)',
          cost: '$0.00'
        }
      };
    }

    throw new Error('No images generated');
  } catch (error) {
    throw new Error(`HuggingFace generation failed: ${error.message}`);
  }
}

/**
 * FREE Pollinations.ai API (Completely free, no registration)
 */
async function generateWithPollinations(openPrompt, wrappedPrompt, kebabData, requestData = {}) {
  try {
    const baseUrl = 'https://image.pollinations.ai/prompt';
    
    // Use compact prompts if available, otherwise use the provided prompts
    const openPromptToUse = requestData.openKebabPromptCompact || openPrompt;
    const wrappedPromptToUse = requestData.wrappedKebabPromptCompact || wrappedPrompt;
    
    console.log('🤖 Pollinations AI prompt length:', {
      open: openPromptToUse.length,
      wrapped: wrappedPromptToUse.length,
      ingredients: kebabData.ingredientDetails?.map(i => i.name).join(', ') || 'not specified'
    });
    
    // Clean prompts for URL encoding (Pollinations supports longer prompts)
    const cleanOpenPrompt = encodeURIComponent(openPromptToUse.slice(0, 1000));
    const cleanWrappedPrompt = encodeURIComponent(wrappedPromptToUse.slice(0, 800));
    
    // Generate URLs (Pollinations generates images via GET requests)
    const openImageUrl = `${baseUrl}/${cleanOpenPrompt}?width=512&height=512&model=flux&seed=${Math.floor(Math.random() * 10000)}`;
    const wrappedImageUrl = `${baseUrl}/${cleanWrappedPrompt}?width=512&height=512&model=flux&seed=${Math.floor(Math.random() * 10000)}`;

    // Test if URLs are accessible and handle rate limiting
    try {
      const testResponse = await fetch(openImageUrl, { method: 'HEAD', timeout: 10000 });
      if (!testResponse.ok) {
        if (testResponse.status === 429) {
          throw new Error('Too many requests from this IP, please try again later.');
        }
        throw new Error(`Service unavailable (${testResponse.status})`);
      }
    } catch (error) {
      if (error.message.includes('Too many requests')) {
        throw new Error('Pollinations.ai rate limited - too many requests');
      }
      throw new Error(`Pollinations service test failed: ${error.message}`);
    }

    return {
      openKebabImage: openImageUrl,
      wrappedKebabImage: wrappedImageUrl,
      metadata: {
        generationTime: '5-10s',
        model: 'Flux (Pollinations)',
        resolution: '512x512',
        style: 'AI-generated',
        service: 'Pollinations.ai (Free)',
        cost: '$0.00'
      }
    };
  } catch (error) {
    throw new Error(`Pollinations generation failed: ${error.message}`);
  }
}

/**
 * FREE Craiyon API (formerly DALL-E mini)
 */
async function generateWithCraiyon(openPrompt, wrappedPrompt, kebabData) {
  try {
    const baseUrl = 'https://api.craiyon.com/v3';
    
    // Generate open kebab image
    const openResponse = await fetch(`${baseUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: openPrompt.slice(0, 300), // Craiyon improved prompt length
        model: 'art',
        negative_prompt: 'blurry, low quality'
      }),
      timeout: 4000 // Faster timeout for Craiyon
    });

    if (!openResponse.ok) {
      throw new Error('Craiyon API request failed');
    }

    const openData = await openResponse.json();
    
    // Craiyon returns base64 images
    const openImageUrl = openData.images && openData.images[0] 
      ? `data:image/jpeg;base64,${openData.images[0]}`
      : null;

    // For demo purposes, use same image for wrapped (to avoid double API calls)
    const wrappedImageUrl = openImageUrl;

    if (openImageUrl) {
      return {
        openKebabImage: openImageUrl,
        wrappedKebabImage: wrappedImageUrl,
        metadata: {
          generationTime: '30-60s',
          model: 'Craiyon v3',
          resolution: '512x512',
          style: 'AI-generated',
          service: 'Craiyon (Free)',
          cost: '$0.00'
        }
      };
    }

    throw new Error('No images returned from Craiyon');
  } catch (error) {
    throw new Error(`Craiyon generation failed: ${error.message}`);
  }
}

/**
 * High-quality SVG fallback when all AI services fail
 */
function generateSVGFallback(kebabData) {
  return {
    openKebabImage: generatePlaceholderImageUrl('open-kebab', kebabData),
    wrappedKebabImage: generatePlaceholderImageUrl('wrapped-kebab', kebabData),
    metadata: {
      generationTime: '0.1s',
      model: 'SVG-Generator',
      resolution: '512x512',
      style: 'Vector-Art',
      service: 'Local SVG (Free)',
      cost: '$0.00',
      note: 'High-quality vector graphics used as fallback'
    }
  };
}

/**
 * Generate SVG placeholder images
 */
function generatePlaceholderImageUrl(type, kebabData) {
  const { size, ingredients, measurements } = kebabData;
  
  if (type === 'open-kebab') {
    const svg = createOpenKebabSVG(size, ingredients, measurements);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  } else {
    const svg = createWrappedKebabSVG(size, measurements);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }
}

/**
 * Create SVG representation of open kebab
 */
function createOpenKebabSVG(size, ingredients, measurements) {
  const colors = {
    'Chicken Breast': '#f4a261',
    'Lamb Meat': '#e63946',
    'Beef Kebab': '#8b2635',
    'Mixed Meat': '#dc2626',
    'Lettuce': '#2d6a2d',
    'Tomatoes': '#dc2626',
    'Onions': '#fbbf24',
    'Cucumbers': '#059669',
    'Peppers': '#dc2626',
    'Pickles': '#22c55e',
    'Garlic Sauce': '#f3f4f6',
    'Chili Sauce': '#dc2626',
    'Yogurt Sauce': '#f8fafc',
    'Tahini': '#d97706',
    'Hummus': '#eab308'
  };

  const ingredientElements = ingredients.slice(0, 12).map((ingredient, index) => {
    const x = 80 + (index % 6) * 60;
    const y = 140 + Math.floor(index / 6) * 50;
    const color = colors[ingredient] || '#94a3b8';
    
    return `
      <ellipse cx="${x}" cy="${y}" rx="25" ry="18" fill="${color}" opacity="0.9" stroke="#374151" stroke-width="1"/>
      <text x="${x}" y="${y + 35}" text-anchor="middle" font-size="9" font-weight="bold" fill="#374151">${ingredient.slice(0, 10)}</text>
    `;
  }).join('');

  return `
    <svg width="500" height="400" xmlns="http://www.w3.org/2000/svg">
      <!-- Background gradient -->
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="500" height="400" fill="url(#bgGradient)"/>
      
      <!-- Tortilla base (open and spread) -->
      <ellipse cx="250" cy="200" rx="220" ry="140" fill="#f4e4bc" stroke="#d4a574" stroke-width="3" opacity="0.9"/>
      <ellipse cx="250" cy="200" rx="210" ry="130" fill="none" stroke="#e6d3a3" stroke-width="1"/>
      
      <!-- Ingredients scattered on tortilla -->
      ${ingredientElements}
      
      <!-- Title with background -->
      <rect x="50" y="20" width="400" height="50" fill="rgba(255,255,255,0.9)" rx="10"/>
      <text x="250" y="40" text-anchor="middle" font-size="22" font-weight="bold" fill="#1f2937">
        ${size.toUpperCase()} KEBAB - OPEN VIEW
      </text>
      <text x="250" y="60" text-anchor="middle" font-size="14" fill="#6b7280">
        🥙 All Ingredients Visible • AI Generated Food Photography
      </text>
      
      <!-- Measurements box -->
      <rect x="350" y="320" width="130" height="60" fill="rgba(255,255,255,0.95)" stroke="#d1d5db" rx="5"/>
      <text x="415" y="340" text-anchor="middle" font-size="12" font-weight="bold" fill="#374151">SPECIFICATIONS</text>
      <text x="415" y="355" text-anchor="middle" font-size="10" fill="#6b7280">Length: ${measurements.length}cm</text>
      <text x="415" y="368" text-anchor="middle" font-size="10" fill="#6b7280">Weight: ${measurements.weight}g</text>
    </svg>
  `;
}

/**
 * Create SVG representation of wrapped kebab with measurements
 */
function createWrappedKebabSVG(size, measurements) {
  const kebabLength = measurements.length * 6; // Scale for display
  const kebabHeight = measurements.diameter * 6;
  
  return `
    <svg width="500" height="400" xmlns="http://www.w3.org/2000/svg">
      <!-- Clean white background -->
      <rect width="500" height="400" fill="#ffffff"/>
      
      <!-- Drop shadow -->
      <ellipse cx="252" cy="202" rx="${kebabLength/2 + 5}" ry="${kebabHeight/2 + 3}" fill="rgba(0,0,0,0.1)" opacity="0.5"/>
      
      <!-- Wrapped kebab -->
      <g transform="translate(250, 200)">
        <!-- Main kebab body with gradient -->
        <defs>
          <linearGradient id="kebabGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#f4e4bc;stop-opacity:1" />
            <stop offset="30%" style="stop-color:#e6d3a3;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#d4a574;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#c49a6b;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <ellipse cx="0" cy="0" rx="${kebabLength/2}" ry="${kebabHeight/2}" 
                 fill="url(#kebabGradient)" stroke="#a8845a" stroke-width="2"/>
        
        <!-- Wrapping texture lines -->
        <path d="M-${kebabLength/2},0 Q-${kebabLength/4},-${kebabHeight/4} 0,0 Q${kebabLength/4},-${kebabHeight/4} ${kebabLength/2},0" 
              stroke="#9d7349" stroke-width="1.5" fill="none" opacity="0.7"/>
        <path d="M-${kebabLength/2},0 Q-${kebabLength/4},${kebabHeight/4} 0,0 Q${kebabLength/4},${kebabHeight/4} ${kebabLength/2},0" 
              stroke="#9d7349" stroke-width="1.5" fill="none" opacity="0.7"/>
        
        <!-- Kebab end details -->
        <circle cx="-${kebabLength/2}" cy="0" r="3" fill="#8b6914"/>
        <circle cx="${kebabLength/2}" cy="0" r="3" fill="#8b6914"/>
      </g>
      
      <!-- Measurement lines with arrows -->
      <!-- Length measurement -->
      <line x1="70" y1="280" x2="${430}" y2="280" stroke="#1f2937" stroke-width="2"/>
      <polygon points="70,275 70,285 60,280" fill="#1f2937"/>
      <polygon points="430,275 430,285 440,280" fill="#1f2937"/>
      <text x="250" y="300" text-anchor="middle" font-size="16" font-weight="bold" fill="#1f2937">${measurements.length} cm</text>
      
      <!-- Diameter measurement -->
      <line x1="180" y1="120" x2="180" y2="280" stroke="#1f2937" stroke-width="2"/>
      <polygon points="175,120 185,120 180,110" fill="#1f2937"/>
      <polygon points="175,280 185,280 180,290" fill="#1f2937"/>
      <text x="160" y="205" text-anchor="middle" font-size="16" font-weight="bold" fill="#1f2937" 
            transform="rotate(-90, 160, 205)">⌀ ${measurements.diameter} cm</text>
      
      <!-- Title section -->
      <rect x="50" y="20" width="400" height="70" fill="rgba(31,41,55,0.95)" rx="10"/>
      <text x="250" y="45" text-anchor="middle" font-size="24" font-weight="bold" fill="#ffffff">
        ${size.toUpperCase()} KEBAB
      </text>
      <text x="250" y="65" text-anchor="middle" font-size="14" fill="#d1d5db">
        📏 Technical Specifications • Precise Measurements
      </text>
      <text x="250" y="80" text-anchor="middle" font-size="12" fill="#9ca3af">
        Professional Food Measurement Standards
      </text>
      
      <!-- Weight specification box -->
      <rect x="350" y="320" width="130" height="60" fill="rgba(31,41,55,0.95)" rx="8"/>
      <text x="415" y="340" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">WEIGHT</text>
      <text x="415" y="360" text-anchor="middle" font-size="20" font-weight="bold" fill="#10b981">${measurements.weight}g</text>
      <text x="415" y="375" text-anchor="middle" font-size="9" fill="#9ca3af">Estimated Total</text>
    </svg>
  `;
}

module.exports = router;