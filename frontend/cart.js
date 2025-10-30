class CartManager {
    constructor() {
        this.apiBaseUrl = this.getApiBaseUrl();
        this.cart = [];
        this.ingredients = [];
        
        this.init();
    }

    // Environment-aware API URL detection
    getApiBaseUrl() {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            const protocol = window.location.protocol;
            
            // Local development
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                return 'http://localhost:3000/api';
            }
            
            // Render.com deployment
            if (hostname.includes('onrender.com')) {
                return `${protocol}//${hostname}/api`;
            }
            
            // Vercel deployment
            if (hostname.includes('vercel.app')) {
                return `${protocol}//${hostname}/api`;
            }
            
            // Railway deployment
            if (hostname.includes('railway.app')) {
                return `${protocol}//${hostname}/api`;
            }
            
            // Default production (same domain)
            return `${protocol}//${hostname}/api`;
        }
        
        return '/api'; // Fallback
    }

    async init() {
        console.log('🚀 Initializing cart manager...');
        
        // Try to load ingredients with retry
        let retries = 3;
        while (!this.ingredients && retries > 0) {
            await this.loadIngredients();
            if (!this.ingredients) {
                console.warn(`⚠️ Ingredients loading failed, retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                retries--;
            }
        }
        
        if (!this.ingredients) {
            console.error('❌ Failed to load ingredients after multiple attempts');
            // Fallback: use empty array and show error message
            this.ingredients = [];
        }
        
        console.log('🧄 Ingredients loaded:', this.ingredients ? this.ingredients.length : 'failed');
        this.loadCart();
        this.renderCart();
        this.setupEventListeners();
        console.log('✅ Cart manager initialized');
    }

    async loadIngredients() {
        try {
            console.log('🌐 Fetching ingredients from:', `${this.apiBaseUrl}/kebab-builder/config`);
            const response = await fetch(`${this.apiBaseUrl}/v1/kebab-builder/config`);
            const data = await response.json();
            
            console.log('📦 API response:', data);
            
            if (data.success) {
                this.ingredients = data.data.ingredients;
                console.log('✅ Ingredients loaded successfully:', this.ingredients.length);
            } else {
                console.error('❌ Failed to load ingredients:', data.message);
            }
        } catch (error) {
            console.error('Error loading ingredients:', error);
            // Fallback ingredients for demo
            this.ingredients = [
                { id: 1, name: 'Chicken Breast', category: 'protein', price: 4.50, image: '', protein: 25.4, weight: 120 },
                { id: 2, name: 'Lamb Meat', category: 'protein', price: 6.00, image: '', protein: 22.8, weight: 110 }
            ];
        }
    }

    loadCart() {
        this.cart = JSON.parse(localStorage.getItem('kebabCart') || '[]');
        console.log('🛒 Cart loaded from localStorage:', this.cart);
        console.log('🛒 Cart length:', this.cart.length);
        
        // Validate cart items
        this.cart.forEach((item, index) => {
            console.log(`🔍 Validating cart item ${index}:`, {
                hasSelectedIngredients: Array.isArray(item.selectedIngredients),
                selectedIngredientsLength: item.selectedIngredients ? item.selectedIngredients.length : 0,
                hasPricing: !!item.pricing,
                hasSize: !!item.size,
                structure: Object.keys(item)
            });
        });
    }

    renderCart() {
        console.log('🛒 Rendering cart with', this.cart.length, 'items');
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');
        const cartItemsCount = document.getElementById('cartItemsCount');

        const cartContentContainer = document.getElementById('cartContentContainer');

        if (this.cart.length === 0) {
            console.log('🛒 Cart is empty, showing empty cart message');
            emptyCart.style.display = 'block';
            cartContentContainer.style.display = 'none';
            cartItemsCount.textContent = 'Your cart is empty - time to build some kebabs!';
            return;
        }

        emptyCart.style.display = 'none';
        cartContentContainer.style.display = 'block';
        cartItemsCount.textContent = `${this.cart.length} delicious kebab${this.cart.length > 1 ? 's' : ''} ready for ordering`;

        cartItemsContainer.innerHTML = '';
        let grandTotal = 0;
        let totalProtein = 0;
        let totalWeight = 0;

        this.cart.forEach((kebab, index) => {
            const kebabElement = this.createKebabElement(kebab, index);
            cartItemsContainer.appendChild(kebabElement);
            grandTotal += kebab.pricing.total;
            totalProtein += kebab.protein || 0;
            totalWeight += kebab.weight || 0;
        });

        // Update cart statistics
        const subtotal = grandTotal;
        const tax = subtotal * 0.08;
        const finalTotal = subtotal + tax;

        // Update cart stats section
        document.getElementById('itemCount').textContent = this.cart.length;
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('finalTotalText').textContent = `$${finalTotal.toFixed(2)}`;

        // Update main total display
        document.getElementById('finalTotal').innerHTML = `
            <div>Total: $${finalTotal.toFixed(2)}</div>
            <div style="font-size: 0.9em; margin-top: 5px; opacity: 0.9;">
                🥩 Total Protein: ${totalProtein.toFixed(1)}g | ⚖️ Weight: ${totalWeight.toFixed(0)}g
            </div>
        `;
    }

    createKebabElement(kebab, index) {
        const kebabDiv = document.createElement('div');
        kebabDiv.className = 'cart-item';
        kebabDiv.dataset.index = index;

        // Get ingredient details
        console.log('🥙 Processing kebab:', kebab);
        console.log('🥙 Selected ingredients:', kebab.selectedIngredients);
        console.log('🥙 Available ingredients:', this.ingredients ? this.ingredients.length : 'not loaded');
        
        const selectedIngredientDetails = kebab.selectedIngredients.map(id => {
            const ingredient = this.ingredients.find(ing => ing.id === id);
            if (!ingredient) {
                console.warn('🚫 Ingredient not found for ID:', id);
                // Create a fallback ingredient
                return {
                    id: id,
                    name: `Ingredient ${id}`,
                    category: 'unknown',
                    price: 0,
                    description: 'Ingredient details not available'
                };
            }
            return ingredient;
        }).filter(ing => ing);
        
        console.log('🥙 Found ingredient details:', selectedIngredientDetails.length);

        // Create visual representation
        const kebabVisual = this.createKebabVisual(selectedIngredientDetails);
        const ingredientsList = this.createIngredientsList(selectedIngredientDetails);
        
        // Create AI generated images section
        const aiImagesSection = this.createAIImagesSection(kebab, selectedIngredientDetails, index);

        const proteinContent = kebab.protein || 0;
        const weightContent = kebab.weight || 0;

        kebabDiv.innerHTML = `
            <div class="kebab-visual">
                ${kebabVisual}
                <div class="kebab-details">
                    <div class="kebab-size">${this.capitalizeFirst(kebab.size)} Kebab</div>
                    <div class="ingredients-list">
                        ${ingredientsList}
                    </div>
                    <div class="price-summary">
                        <div class="price-line">
                            <span>Base (${kebab.size}):</span>
                            <span>$${kebab.pricing.base.toFixed(2)}</span>
                        </div>
                        <div class="price-line">
                            <span>Ingredients:</span>
                            <span>$${kebab.pricing.ingredients.toFixed(2)}</span>
                        </div>
                        <div class="price-line">
                            <span>🥩 Protein:</span>
                            <span>${proteinContent.toFixed(1)}g</span>
                        </div>
                        <div class="price-line">
                            <span>⚖️ Weight:</span>
                            <span>${weightContent.toFixed(0)}g</span>
                        </div>
                        <div class="price-line total-price">
                            <span>Subtotal:</span>
                            <span>$${kebab.pricing.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${aiImagesSection}
            
            <div class="cart-actions">
                <button class="action-button remove-button" onclick="cartManager.removeFromCart(${index})">
                    Remove from Cart
                </button>
                <button class="action-button generate-ai-btn" onclick="cartManager.generateKebabImages(${index})" 
                        style="background: linear-gradient(45deg, #667eea, #764ba2) !important; color: white !important; border: none; padding: 12px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; margin: 5px 0; min-width: 180px; display: block; width: 100%;">
                    🎨 Generate AI Images
                </button>
            </div>
        `;

        return kebabDiv;
    }

    createAIImagesSection(kebab, ingredients, index) {
        return `
            <div class="ai-images-section" id="aiImages-${index}" style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px; border: 2px dashed #dee2e6;">
                <h4 style="color: #333; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <span>🎨</span> AI Generated Kebab Images
                    <span style="font-size: 0.7em; color: #666; font-weight: normal;">(Click "Generate AI Images" to create)</span>
                </h4>
                <div class="ai-images-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div class="ai-image-placeholder" style="background: white; border: 2px dashed #ccc; border-radius: 8px; padding: 20px; text-align: center; min-height: 200px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 3em; margin-bottom: 10px;">🥙</div>
                        <h5 style="color: #666; margin: 0;">Open Kebab View</h5>
                        <p style="color: #999; font-size: 0.9em; margin: 5px 0;">All ingredients visible</p>
                    </div>
                    <div class="ai-image-placeholder" style="background: white; border: 2px dashed #ccc; border-radius: 8px; padding: 20px; text-align: center; min-height: 200px; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-size: 3em; margin-bottom: 10px;">📏</div>
                        <h5 style="color: #666; margin: 0;">Wrapped with Measurements</h5>
                        <p style="color: #999; font-size: 0.9em; margin: 5px 0;">Size specifications</p>
                    </div>
                </div>
            </div>
        `;
    }

    createKebabVisual(ingredients) {
        let tortillaColor = '#f4e4bc'; // default
        const tortilla = ingredients.find(ing => ing.category === 'tortilla');
        
        if (tortilla) {
            switch (tortilla.name) {
                case 'Whole Wheat Tortilla':
                    tortillaColor = '#d4a574';
                    break;
                case 'Spinach Tortilla':
                    tortillaColor = '#9fbc82';
                    break;
                case 'Tomato Tortilla':
                    tortillaColor = '#e88a85';
                    break;
                default:
                    tortillaColor = '#f4e4bc';
            }
        }

        const ingredientVisuals = ingredients
            .filter(ing => ing.category !== 'tortilla')
            .slice(0, 8) // Limit to prevent overcrowding
            .map(ingredient => `
                <div class="ingredient-visual" 
                     style="background-image: url('${ingredient.image}')"
                     title="${ingredient.name}">
                </div>
            `).join('');

        return `
            <div class="kebab-illustration">
                <div class="tortilla-layer" style="background-color: ${tortillaColor}"></div>
                <div class="ingredients-layer">
                    ${ingredientVisuals}
                </div>
                <div style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); 
                           padding: 5px 10px; border-radius: 15px; font-size: 0.8em; font-weight: bold; color: #333;">
                    🥙 Kebab Preview
                </div>
            </div>
        `;
    }

    createIngredientsList(ingredients) {
        return ingredients.map(ingredient => {
            const priceText = ingredient.price === 0 ? 'FREE' : `+$${ingredient.price.toFixed(2)}`;
            return `
                <div class="ingredient-item">
                    <img src="${ingredient.image}" alt="${ingredient.name}" class="ingredient-thumbnail" 
                         onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect width=%2260%22 height=%2260%22 fill=%22%23f8f9fa%22 stroke=%22%23dee2e6%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2220%22>🍽️</text></svg>'">
                    <div class="ingredient-info">
                        <div class="ingredient-name">${ingredient.name}</div>
                        <div class="ingredient-price">${priceText}</div>
                        <div style="font-size: 0.7em; color: #28a745; font-weight: bold;">
                            🥩 ${ingredient.protein}g protein • ⚖️ ${ingredient.weight}g
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    removeFromCart(index) {
        if (confirm('Are you sure you want to remove this kebab from your cart?')) {
            this.cart.splice(index, 1);
            localStorage.setItem('kebabCart', JSON.stringify(this.cart));
            this.renderCart();
        }
    }

    clearCart() {
        if (confirm('Are you sure you want to clear your entire cart?')) {
            this.cart = [];
            localStorage.setItem('kebabCart', JSON.stringify(this.cart));
            this.renderCart();
        }
    }

    async checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const customerName = prompt('Enter your name:');
        if (!customerName) return;

        const customerPhone = prompt('Enter your phone number:');
        if (!customerPhone) return;

        const specialInstructions = prompt('Any special instructions? (optional)') || '';

        try {
            const orders = [];
            let grandTotal = 0;

            // Create orders for each kebab
            for (const kebab of this.cart) {
                const response = await fetch(`${this.apiBaseUrl}/kebab-builder/create`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        size: kebab.size,
                        selectedIngredients: kebab.selectedIngredients,
                        customerName,
                        specialInstructions
                    })
                });
                
                const data = await response.json();
                if (data.success) {
                    orders.push(data.data);
                    grandTotal += data.data.pricing.totalPrice;
                }
            }

            if (orders.length > 0) {
                // Create order summary
                const orderSummary = {
                    orderIds: orders.map(o => o.orderId),
                    customerName,
                    customerPhone,
                    totalKebabs: orders.length,
                    grandTotal: grandTotal.toFixed(2),
                    orderDate: new Date().toLocaleDateString(),
                    orderTime: new Date().toLocaleTimeString()
                };

                // Show success message
                alert(`🎉 Order placed successfully!

Customer: ${customerName}
Phone: ${customerPhone}
Total Kebabs: ${orderSummary.totalKebabs}
Grand Total: $${orderSummary.grandTotal}

Order IDs: ${orderSummary.orderIds.join(', ')}

Thank you for choosing Aslan Food!
Your kebabs will be ready in 15-20 minutes.`);

                // Clear cart and redirect
                this.cart = [];
                localStorage.setItem('kebabCart', JSON.stringify(this.cart));
                
                // Redirect back to builder after a moment
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    }

    setupEventListeners() {
        const checkoutButton = document.getElementById('checkoutButton');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => this.checkout());
        }
    }

    async generateKebabImages(index) {
        console.log('🎨 Generate AI Images clicked for kebab index:', index);
        
        const kebab = this.cart[index];
        if (!kebab) {
            console.error('Kebab not found at index:', index);
            return;
        }

        const aiImagesContainer = document.querySelector(`#aiImages-${index} .ai-images-container`);
        if (!aiImagesContainer) {
            console.error('AI images container not found for index:', index);
            return;
        }

        console.log('🎨 Starting AI image generation...');

        // Get ingredient details
        const selectedIngredientDetails = kebab.selectedIngredients.map(id => {
            return this.ingredients.find(ing => ing.id === id);
        }).filter(ing => ing);

        console.log('🧅 Selected ingredient IDs:', kebab.selectedIngredients);
        console.log('🥙 Resolved ingredient details:', selectedIngredientDetails.map(ing => ({ id: ing.id, name: ing.name, category: ing.category })));

        // Show loading state with fallback option
        aiImagesContainer.innerHTML = `
            <div class="ai-image-loading" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div style="font-size: 2em; margin-bottom: 15px;">🎨</div>
                <h4 style="color: #667eea; margin-bottom: 10px;">Generating AI Images...</h4>
                <div style="width: 100%; height: 4px; background: #e9ecef; border-radius: 2px; overflow: hidden;">
                    <div style="height: 100%; background: linear-gradient(45deg, #667eea, #764ba2); width: 0%; animation: loading 3s ease-in-out infinite;" id="loadingBar-${index}"></div>
                </div>
                <p style="color: #666; margin: 10px 0; font-size: 0.9em;">AI services can be slow (15-30 seconds)...</p>
                <button onclick="window.cartManager?.triggerSVGFallback?.(this.closest('.cart-item'))" 
                        style="background: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 0.9em; margin-top: 10px;">
                    🚀 Load SVG Preview Now
                </button>
            </div>
        `;
        
        // Auto-fallback to SVG after 15 seconds
        setTimeout(() => {
            const loadingElement = document.getElementById(`loadingBar-${index}`);
            if (loadingElement && loadingElement.closest('.ai-image-loading')) {
                console.log('⏰ Auto-triggering SVG fallback after 15 seconds');
                this.triggerSVGFallback(document.querySelector(`[data-index="${index}"]`));
            }
        }, 15000);

        // Add loading animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes loading {
                0% { width: 0%; }
                50% { width: 70%; }
                100% { width: 100%; }
            }
        `;
        document.head.appendChild(style);

        try {
            // Generate prompts for both images
            const openKebabPrompts = this.generateOpenKebabPrompt(kebab, selectedIngredientDetails);
            const wrappedKebabPrompts = this.generateWrappedKebabPrompt(kebab, selectedIngredientDetails);

            // Call backend API to generate images with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(`${this.apiBaseUrl}/v1/kebab-builder/generate-images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal,
                body: JSON.stringify({
                    openKebabPrompt: openKebabPrompts.detailed,
                    openKebabPromptCompact: openKebabPrompts.compact,
                    wrappedKebabPrompt: wrappedKebabPrompts.detailed,
                    wrappedKebabPromptCompact: wrappedKebabPrompts.compact,
                    kebabData: {
                        size: kebab.size,
                        ingredients: selectedIngredientDetails.map(ing => ing.name),
                        measurements: this.getKebabMeasurements(kebab.size),
                        ingredientDetails: selectedIngredientDetails.map(ing => ({
                            id: ing.id,
                            name: ing.name,
                            category: ing.category
                        }))
                    }
                })
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (data.success) {
                // Display generated images
                this.displayGeneratedImages(aiImagesContainer, data.data, kebab);
            } else {
                throw new Error(data.message || 'Failed to generate images');
            }

        } catch (error) {
            const isTimeout = error.name === 'AbortError';
            const isRateLimit = error.message && (error.message.includes('rate limit') || error.message.includes('Too many requests'));
            
            console.error(`${isTimeout ? '⏰ AI generation timeout' : (isRateLimit ? '🚫 AI service rate limited' : '❌ AI generation error')}:`, error);
            
            // Determine error type and message
            let errorTitle = 'AI Service Unavailable';
            let errorIcon = '⚡';
            
            if (isTimeout) {
                errorTitle = 'AI Service Timeout';
                errorIcon = '⏰';
            } else if (isRateLimit) {
                errorTitle = 'AI Service Temporarily Busy';
                errorIcon = '⏸️';
            }
            
            // Show immediate fallback message
            aiImagesContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; background: linear-gradient(135deg, #e67e22 0%, #f39c12 100%); color: white; border-radius: 15px;">
                    <div style="font-size: 3em; margin-bottom: 15px;">${errorIcon}</div>
                    <h5 style="margin: 0; margin-bottom: 10px;">${errorTitle}</h5>
                    <p style="margin: 0; font-size: 0.9em; opacity: 0.9;">Loading professional SVG visualization...</p>
                </div>
            `;
            
            console.log(`🔄 ${isTimeout ? 'Timeout' : 'Error'} - switching to SVG fallback immediately`);
            
            // Try to get SVG preview as fallback
            try {
                const svgResponse = await fetch(`${this.apiBaseUrl}/v1/ingredients/preview`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        size: kebab.size,
                        selectedIngredients: kebab.selectedIngredients.map(String)
                    })
                });
                
                const svgData = await svgResponse.json();
                if (svgData.success) {
                    console.log('✅ SVG fallback loaded successfully');
                    this.displaySVGFallback(aiImagesContainer, kebab, selectedIngredientDetails, svgData.data);
                } else {
                    console.log('⚠️ SVG generation failed, using text fallback');
                    this.displayFallbackImages(aiImagesContainer, kebab, selectedIngredientDetails);
                }
            } catch (svgError) {
                console.error('Error generating SVG fallback:', svgError);
                // Final fallback to placeholder images with detailed descriptions
                this.displayFallbackImages(aiImagesContainer, kebab, selectedIngredientDetails);
            }
        }
    }

    generateOpenKebabPrompt(kebab, ingredients) {
        console.log('🔍 Generating AI prompt for ingredients:', ingredients.map(ing => ing.name));
        
        const tortillaType = ingredients.find(ing => ing.category === 'tortilla')?.name || 'White Flour Tortilla';
        const proteins = ingredients.filter(ing => ing.category === 'protein');
        const vegetables = ingredients.filter(ing => ing.category === 'vegetables');
        const sauces = ingredients.filter(ing => ing.category === 'sauces');
        const extras = ingredients.filter(ing => ing.category === 'extras');
        
        // Create very specific descriptions for each ingredient
        let ingredientDetails = [];
        
        // Base tortilla
        ingredientDetails.push(`BASE: ${tortillaType} laid flat and fully opened`);
        
        // Proteins with specific descriptions
        if (proteins.length > 0) {
            proteins.forEach(protein => {
                switch(protein.name) {
                    case 'Grilled Chicken':
                        ingredientDetails.push('PROTEIN: Grilled chicken breast strips - golden brown, tender pieces');
                        break;
                    case 'Lamb Kebab':
                        ingredientDetails.push('PROTEIN: Seasoned lamb kebab meat - dark brown, juicy chunks');
                        break;
                    case 'Beef Doner':
                        ingredientDetails.push('PROTEIN: Sliced beef doner - thin strips, well-seasoned');
                        break;
                    case 'Mixed Grill':
                        ingredientDetails.push('PROTEIN: Mixed grilled meats - combination of chicken and lamb pieces');
                        break;
                    case 'Falafel':
                        ingredientDetails.push('PROTEIN: Golden brown falafel balls - crispy exterior, green herbs visible');
                        break;
                    default:
                        ingredientDetails.push(`PROTEIN: ${protein.name.toLowerCase()}`);
                }
            });
        }
        
        // Vegetables with specific descriptions
        if (vegetables.length > 0) {
            vegetables.forEach(veg => {
                switch(veg.name) {
                    case 'Fresh Lettuce':
                        ingredientDetails.push('VEGETABLE: Fresh iceberg lettuce - crisp green leaves, finely shredded');
                        break;
                    case 'Fresh Tomatoes':
                        ingredientDetails.push('VEGETABLE: Fresh tomato slices - bright red, juicy rounds');
                        break;
                    case 'Red Onions':
                        ingredientDetails.push('VEGETABLE: Red onion slices - purple-red rings, thinly cut');
                        break;
                    case 'Cucumbers':
                        ingredientDetails.push('VEGETABLE: Fresh cucumber slices - pale green rounds with dark green skin');
                        break;
                    case 'Bell Peppers':
                        ingredientDetails.push('VEGETABLE: Colorful bell pepper strips - red, yellow, and green pieces');
                        break;
                    case 'Pickles':
                        ingredientDetails.push('VEGETABLE: Dill pickle slices - small green rounds with bumpy texture');
                        break;
                    case 'Jalapeños':
                        ingredientDetails.push('VEGETABLE: Jalapeño pepper slices - bright green rings, small and spicy');
                        break;
                    default:
                        ingredientDetails.push(`VEGETABLE: ${veg.name.toLowerCase()}`);
                }
            });
        }
        
        // Sauces with specific descriptions
        if (sauces.length > 0) {
            sauces.forEach(sauce => {
                switch(sauce.name) {
                    case 'Garlic Aioli':
                        ingredientDetails.push('SAUCE: Creamy white garlic aioli - smooth drizzle pattern');
                        break;
                    case 'Hot Sauce':
                        ingredientDetails.push('SAUCE: Bright red hot sauce - thin spicy drizzle');
                        break;
                    case 'Tzatziki':
                        ingredientDetails.push('SAUCE: White tzatziki sauce - creamy with green herb flecks');
                        break;
                    case 'Tahini Sauce':
                        ingredientDetails.push('SAUCE: Light brown tahini sauce - smooth sesame drizzle');
                        break;
                    case 'Hummus':
                        ingredientDetails.push('SAUCE: Beige hummus spread - smooth chickpea paste');
                        break;
                    default:
                        ingredientDetails.push(`SAUCE: ${sauce.name.toLowerCase()}`);
                }
            });
        }
        
        // Extras with specific descriptions
        if (extras.length > 0) {
            extras.forEach(extra => {
                switch(extra.name) {
                    case 'Melted Cheese':
                        ingredientDetails.push('EXTRA: Melted yellow cheese - gooey golden layer');
                        break;
                    case 'Crispy Fries':
                        ingredientDetails.push('EXTRA: Golden french fries - crispy potato sticks inside kebab');
                        break;
                    case 'Grilled Halloumi':
                        ingredientDetails.push('EXTRA: Grilled halloumi cheese - white squares with grill marks');
                        break;
                    case 'Double Meat':
                        ingredientDetails.push('EXTRA: Double portion of selected meat - extra protein layer');
                        break;
                    case 'Avocado':
                        ingredientDetails.push('EXTRA: Fresh avocado slices - bright green creamy pieces');
                        break;
                    case 'Olives':
                        ingredientDetails.push('EXTRA: Mixed olives - black and green Mediterranean olives');
                        break;
                    default:
                        ingredientDetails.push(`EXTRA: ${extra.name.toLowerCase()}`);
                }
            });
        }
        
        // Create both detailed and compact versions
        const detailedPrompt = `HIGH-PRECISION FOOD PHOTOGRAPHY: Open ${kebab.size} kebab laid completely flat on white marble surface.

MANDATORY INGREDIENT LIST (ONLY THESE - NO SUBSTITUTIONS):
${ingredientDetails.join('\n')}

STRICT RULES:
- Total ingredients count: EXACTLY ${ingredients.length} items
- NO random vegetables, NO generic fillings
- Each ingredient must match the specific name listed
- Perfect lighting showing true colors
- Top-down view, professional food photography
- Ultra-detailed 4K, restaurant quality
- Each ingredient easily identifiable

FORBIDDEN: Do not add lettuce unless "Fresh Lettuce" is listed. Do not add tomatoes unless "Fresh Tomatoes" is listed. Do not add any ingredient not explicitly mentioned above.`;

        // Create compact version for services with length limits
        const ingredientNames = ingredients.map(ing => ing.name).join(', ');
        const compactPrompt = `Open ${kebab.size} kebab on white surface. EXACT ingredients: ${tortillaType}, ${ingredientNames}. Professional food photo, top view, all ingredients visible and identifiable. NO other ingredients.`;
        
        const prompt = {
            detailed: detailedPrompt,
            compact: compactPrompt,
            ingredients: ingredientNames
        };
        
        console.log('🤖 Generated AI prompts:', { 
            detailed: detailedPrompt.length + ' chars', 
            compact: compactPrompt.length + ' chars',
            ingredients: ingredientNames
        });
        return prompt;
    }

    generateWrappedKebabPrompt(kebab, ingredients) {
        const measurements = this.getKebabMeasurements(kebab.size);
        const tortillaType = ingredients.find(ing => ing.category === 'tortilla')?.name || 'White Flour Tortilla';
        const totalIngredients = ingredients.length;
        
        // Get specific filling preview
        const proteins = ingredients.filter(ing => ing.category === 'protein').map(p => p.name).join(' and ') || '';
        const mainVegetables = ingredients.filter(ing => ing.category === 'vegetables').slice(0, 2).map(v => v.name).join(' and ') || '';
        
        console.log('🌯 Generating wrapped kebab prompt for:', { tortillaType, proteins, mainVegetables, totalIngredients });
        
        const detailedPrompt = `Professional commercial food photography of a perfectly wrapped ${kebab.size} kebab on a clean white marble background. 

SPECIFIC KEBAB DETAILS:
- Wrap: ${tortillaType} - golden brown exterior with proper tortilla texture
- Size: exactly ${measurements.length}cm length × ${measurements.diameter}cm diameter
- Weight: ${measurements.weight}g
- Contains: ${totalIngredients} premium ingredients including ${proteins}${mainVegetables ? ` with ${mainVegetables}` : ''}

VISUAL REQUIREMENTS:
- Perfect cylindrical wrap shape, tightly rolled
- Tortilla exterior showing natural texture and slight browning
- Both ends slightly open showing colorful filling ingredients
- Professional food styling with slight moisture on surface
- Clean white measurement overlay lines with precise dimensions
- Technical ruler markings showing exact measurements
- Studio lighting creating soft shadows

CRITICAL: The kebab must look substantial and filled, matching the ${measurements.weight}g weight specification. Ultra-high resolution, commercial food photography quality, minimalist composition with precise measurement annotations in white text overlay.`;

        const compactPrompt = `Wrapped ${kebab.size} kebab with ${tortillaType}, ${measurements.length}cm × ${measurements.diameter}cm, contains ${proteins}${mainVegetables ? ` and ${mainVegetables}` : ''}. Professional food photo with measurement overlay.`;

        return {
            detailed: detailedPrompt,
            compact: compactPrompt
        };
    }

    getKebabMeasurements(size) {
        const measurements = {
            small: { length: 15, diameter: 4, weight: 200 },
            medium: { length: 20, diameter: 5, weight: 300 },
            large: { length: 25, diameter: 6, weight: 400 },
            xlarge: { length: 30, diameter: 7, weight: 500 }
        };
        return measurements[size] || measurements.medium;
    }

    displayGeneratedImages(container, imageData, kebab) {
        const measurements = this.getKebabMeasurements(kebab.size);
        
        container.innerHTML = `
            <div class="ai-generated-image" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <img src="${imageData.openKebabImage}" 
                     alt="Open kebab showing all ingredients" 
                     style="width: 100%; height: 200px; object-fit: cover;"
                     onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=&quot;padding: 40px; text-align: center; background: linear-gradient(135deg, #d4a574 0%, #f4e4bc 100%); color: #8B4513;&quot;><div style=&quot;font-size: 3em; margin-bottom: 10px;&quot;>🥙</div><h5 style=&quot;margin: 0; margin-bottom: 8px;&quot;>SVG Preview Loading...</h5><p style=&quot;margin: 0; font-size: 0.9em; opacity: 0.8;&quot;>Enhanced visualization will appear shortly</p></div>'; setTimeout(() => window.cartManager?.triggerSVGFallback?.(this.closest('.cart-item')), 100);"
                <div style="padding: 10px; text-align: center;">
                    <h5 style="margin: 0; color: #333;">Open Kebab View</h5>
                    <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #666;">All ingredients visible</p>
                </div>
            </div>
            <div class="ai-generated-image" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <img src="${imageData.wrappedKebabImage}" 
                     alt="Wrapped kebab with size measurements" 
                     style="width: 100%; height: 200px; object-fit: cover;"
                     onerror="this.parentElement.innerHTML='<div style=&quot;padding: 20px; text-align: center; color: #666;&quot;><div style=&quot;font-size: 2em;&quot;>📏</div><p>Wrapped with Measurements</p><small>Image generation failed</small></div>'">
                <div style="padding: 10px; text-align: center;">
                    <h5 style="margin: 0; color: #333;">Wrapped Kebab</h5>
                    <p style="margin: 5px 0 0 0; font-size: 0.8em; color: #666;">
                        📏 ${measurements.length}cm × ${measurements.diameter}cm • ⚖️ ${measurements.weight}g
                    </p>
                </div>
            </div>
        `;
    }

    displaySVGFallback(container, kebab, ingredients, svgData) {
        const measurements = this.getKebabMeasurements(kebab.size);
        
        container.innerHTML = `
            <div class="svg-preview-container" style="background: white; border-radius: 15px; padding: 20px; box-shadow: 0 8px 25px rgba(0,0,0,0.1); border: 2px solid #d4a574;">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h5 style="margin: 0; color: #8B4513; font-size: 1.3em;">🥙 Open Kebab View</h5>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">Detailed ingredient assembly visualization</p>
                </div>
                
                <div style="display: flex; justify-content: center; margin-bottom: 20px; background: #f8f9fa; border-radius: 10px; padding: 15px;">
                    ${svgData.visualization.svg}
                </div>
                
                <div style="background: linear-gradient(135deg, #f4e4bc 0%, #d4a574 100%); border-radius: 10px; padding: 15px; color: #333;">
                    <h6 style="margin: 0 0 10px 0; color: #8B4513; font-size: 1em;">📝 Assembly Description</h6>
                    <p style="margin: 0; font-size: 0.85em; line-height: 1.5;">${svgData.visualization.description}</p>
                </div>
            </div>
            
            <div class="measurements-container" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 15px; padding: 20px; color: white; text-align: center; margin-top: 15px;">
                <div style="font-size: 2.5em; margin-bottom: 10px;">📏</div>
                <h5 style="margin: 0; margin-bottom: 15px; font-size: 1.2em;">Size Specifications</h5>
                <div style="background: rgba(255,255,255,0.2); border-radius: 10px; padding: 15px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.9em;">
                        <div><strong>Length:</strong><br>${measurements.length}cm</div>
                        <div><strong>Diameter:</strong><br>${measurements.diameter}cm</div>
                        <div><strong>Weight:</strong><br>${measurements.weight}g</div>
                        <div><strong>Serves:</strong><br>${svgData.size.serves || '1 person'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    displayFallbackImages(container, kebab, ingredients) {
        const measurements = this.getKebabMeasurements(kebab.size);
        
        // Organize ingredients by category
        const tortilla = ingredients.find(ing => ing.category === 'tortilla');
        const proteins = ingredients.filter(ing => ing.category === 'protein');
        const vegetables = ingredients.filter(ing => ing.category === 'vegetables');
        const sauces = ingredients.filter(ing => ing.category === 'sauces');
        const extras = ingredients.filter(ing => ing.category === 'extras');
        
        container.innerHTML = `
            <div class="ai-image-fallback" style="background: linear-gradient(135deg, #d4a574 0%, #f4e4bc 100%); border-radius: 15px; padding: 25px; color: #333; text-align: center; border: 3px solid #d4a574;">
                <div style="font-size: 3em; margin-bottom: 15px;">🥙</div>
                <h5 style="margin: 0; margin-bottom: 15px; color: #8B4513; font-size: 1.2em;">Open Kebab Assembly View</h5>
                <p style="font-size: 0.9em; margin-bottom: 15px; color: #666;">
                    ${this.capitalizeFirst(kebab.size)} kebab showing ingredient layers
                </p>
                
                <div style="background: rgba(255,255,255,0.9); border-radius: 10px; padding: 15px; margin-bottom: 15px;">
                    <div style="text-align: left; font-size: 0.85em; line-height: 1.6;">
                        <div style="margin-bottom: 8px;"><strong>🌯 BASE:</strong> ${tortilla ? tortilla.name : 'White Flour Tortilla'}</div>
                        ${proteins.length > 0 ? `<div style="margin-bottom: 8px;"><strong>🥩 PROTEIN:</strong> ${proteins.map(p => p.name).join(', ')}</div>` : ''}
                        ${vegetables.length > 0 ? `<div style="margin-bottom: 8px;"><strong>🥬 VEGETABLES:</strong> ${vegetables.map(v => v.name).join(', ')}</div>` : ''}
                        ${sauces.length > 0 ? `<div style="margin-bottom: 8px;"><strong>🥄 SAUCES:</strong> ${sauces.map(s => s.name).join(', ')}</div>` : ''}
                        ${extras.length > 0 ? `<div style="margin-bottom: 8px;"><strong>✨ EXTRAS:</strong> ${extras.map(e => e.name).join(', ')}</div>` : ''}
                    </div>
                </div>
                
                <div style="background: rgba(139, 69, 19, 0.1); border-radius: 8px; padding: 10px; font-size: 0.75em; color: #8B4513;">
                    <strong>Assembly Order:</strong> Base → Protein → Vegetables → Sauces → Extras
                </div>
            </div>
            <div class="ai-image-fallback" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 8px; padding: 20px; color: white; text-align: center;">
                <div style="font-size: 3em; margin-bottom: 10px;">📏</div>
                <h5 style="margin: 0; margin-bottom: 10px;">Size Specifications</h5>
                <div style="background: rgba(255,255,255,0.2); border-radius: 5px; padding: 15px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9em;">
                        <div><strong>Length:</strong><br>${measurements.length}cm</div>
                        <div><strong>Diameter:</strong><br>${measurements.diameter}cm</div>
                        <div style="grid-column: 1 / -1; margin-top: 5px;">
                            <strong>Weight:</strong> ${measurements.weight}g
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    displaySVGFallback(container, kebab, ingredients, svgData) {
        const measurements = this.getKebabMeasurements(kebab.size);
        
        container.innerHTML = `
            <div class="svg-preview-container" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.15); border: 2px solid #d4a574;">
                <div style="padding: 15px; background: linear-gradient(135deg, #d4a574 0%, #f4e4bc 100%); text-align: center;">
                    <h5 style="margin: 0; color: #8B4513; font-weight: 700;">🥙 Open Kebab Assembly View</h5>
                    <p style="margin: 5px 0 0 0; color: #666; font-size: 0.9em;">Professional ingredient visualization</p>
                </div>
                <div style="padding: 20px; display: flex; justify-content: center; background: #fafafa;">
                    ${svgData.visualization.svg}
                </div>
                <div style="padding: 15px; background: white;">
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
                        <p style="margin: 0; font-size: 0.85em; color: #333; line-height: 1.5;">
                            <strong>Assembly Description:</strong><br>
                            ${svgData.visualization.description}
                        </p>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.8em; color: #666;">
                        <div><strong>📏 Length:</strong> ${measurements.length}cm</div>
                        <div><strong>📐 Diameter:</strong> ${measurements.diameter}cm</div>
                        <div><strong>⚖️ Weight:</strong> ${measurements.weight}g</div>
                        <div><strong>🥙 Style:</strong> ${kebab.size} kebab</div>
                    </div>
                </div>
            </div>
            <div class="wrapped-kebab-preview" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 15px; padding: 25px; color: white; text-align: center; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                <div style="font-size: 3em; margin-bottom: 15px;">📏</div>
                <h5 style="margin: 0; margin-bottom: 15px; font-size: 1.2em;">Wrapped Kebab Specifications</h5>
                <div style="background: rgba(255,255,255,0.2); border-radius: 10px; padding: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 0.9em; margin-bottom: 15px;">
                        <div><strong>📏 Length:</strong><br>${measurements.length} cm</div>
                        <div><strong>📐 Diameter:</strong><br>${measurements.diameter} cm</div>
                        <div><strong>⚖️ Weight:</strong><br>${measurements.weight} g</div>
                        <div><strong>👥 Serves:</strong><br>${svgData.size.serves || '1'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); border-radius: 5px; padding: 10px; font-size: 0.8em;">
                        <strong>Perfect for:</strong> ${svgData.size.description || 'A satisfying meal'}
                    </div>
                </div>
            </div>
        `;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    async triggerSVGFallback(cartItemElement) {
        try {
            if (!cartItemElement) return;
            
            const index = cartItemElement.dataset.index;
            const kebab = this.cart[index];
            if (!kebab) return;

            // Get ingredient details
            const selectedIngredientDetails = kebab.selectedIngredients.map(id => {
                return this.ingredients.find(ing => ing.id === id);
            }).filter(ing => ing);

            // Find the AI images container
            const aiImagesContainer = cartItemElement.querySelector('.ai-images');
            if (!aiImagesContainer) return;

            console.log('Triggering SVG fallback for kebab:', kebab);

            // Get SVG preview
            const svgResponse = await fetch(`${this.apiBaseUrl}/v1/ingredients/preview`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    size: kebab.size,
                    selectedIngredients: kebab.selectedIngredients.map(String)
                })
            });
            
            const svgData = await svgResponse.json();
            if (svgData.success) {
                this.displaySVGFallback(aiImagesContainer, kebab, selectedIngredientDetails, svgData.data);
            } else {
                this.displayFallbackImages(aiImagesContainer, kebab, selectedIngredientDetails);
            }
        } catch (error) {
            console.error('Error in SVG fallback:', error);
            // Show the enhanced fallback images instead
            const aiImagesContainer = cartItemElement?.querySelector('.ai-images');
            if (aiImagesContainer) {
                const index = cartItemElement.dataset.index;
                const kebab = this.cart[index];
                const selectedIngredientDetails = kebab?.selectedIngredients.map(id => {
                    return this.ingredients.find(ing => ing.id === id);
                }).filter(ing => ing) || [];
                
                this.displayFallbackImages(aiImagesContainer, kebab, selectedIngredientDetails);
            }
        }
    }
}

// Global instance for onclick handlers
let cartManager;

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
});

// Global function to add test kebab to cart
// Debug function to clear cart
window.clearCart = function() {
    localStorage.removeItem('kebabCart');
    console.log('🗑️ Cart cleared from localStorage');
    window.location.reload();
};

// Debug function to show cart contents
window.showCartContents = function() {
    const cart = JSON.parse(localStorage.getItem('kebabCart') || '[]');
    console.log('🛒 Current cart contents:', cart);
    console.log('🛒 Cart length:', cart.length);
    return cart;
};

window.addTestKebab = function() {
    console.log('🧪 Adding test kebab...');
    
    const testKebab = {
        id: Date.now(),
        size: 'large',
        selectedIngredients: [21, 1, 2, 5, 6, 7, 11, 13, 16, 18], // Mix of all categories
        pricing: {
            base: 9.00,
            ingredients: 8.35,
            total: 17.35
        },
        protein: 45.2,
        weight: 625,
        timestamp: Date.now()
    };
    
    const cart = JSON.parse(localStorage.getItem('kebabCart') || '[]');
    console.log('🛒 Current cart before adding:', cart);
    
    cart.push(testKebab);
    localStorage.setItem('kebabCart', JSON.stringify(cart));
    
    console.log('🛒 Cart after adding:', cart);
    console.log('✅ Test kebab added to cart! Reload page to see the improved visualization system.');
    
    // Reload the page to show the new cart item
    setTimeout(() => {
        window.location.reload();
    }, 500);
};

// Force refresh the cart display
window.refreshCartDisplay = function() {
    if (window.cartManager) {
        console.log('🔄 Force refreshing cart display...');
        window.cartManager.loadCart();
        window.cartManager.renderCart();
    } else {
        console.error('❌ Cart manager not initialized');
    }
};

// Global function to force SVG preview (bypass AI)
window.forceSVGPreview = function() {
    if (window.cartManager) {
        const cartItems = document.querySelectorAll('.cart-item');
        cartItems.forEach(item => {
            console.log('🎨 Forcing SVG preview for cart item');
            window.cartManager.triggerSVGFallback(item);
        });
    } else {
        console.log('❌ Cart manager not ready');
    }
};

// Global function to test SVG preview
window.testSVGPreview = async function(size = 'medium', ingredients = ['1', '5', '6', '11', '16']) {
    if (!cartManager) {
        console.error('Cart manager not initialized');
        return;
    }
    
    try {
        const response = await fetch(`${cartManager.apiBaseUrl}/v1/ingredients/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                size: size,
                selectedIngredients: ingredients
            })
        });
        
        const data = await response.json();
        if (data.success) {
            console.log('✅ SVG Preview Data:', data.data);
            
            // Create test container
            const testContainer = document.createElement('div');
            testContainer.id = 'svg-test-container';
            testContainer.style.cssText = `
                position: fixed; top: 50px; left: 50px; width: 600px; max-height: 80vh; 
                overflow-y: auto; z-index: 9999; background: white; border-radius: 15px; 
                box-shadow: 0 15px 50px rgba(0,0,0,0.4); border: 3px solid #d4a574;
            `;
            
            // Mock data for display
            const mockKebab = { size: size };
            const mockIngredients = await cartManager.loadIngredients().then(() => {
                return ingredients.map(id => cartManager.ingredients.find(ing => ing.id === parseInt(id))).filter(Boolean);
            });
            
            cartManager.displaySVGFallback(testContainer, mockKebab, mockIngredients, data.data);
            
            // Add close button
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✖ Close Test';
            closeBtn.style.cssText = `
                position: absolute; top: 15px; right: 15px; background: #e74c3c; 
                color: white; border: none; padding: 8px 15px; border-radius: 8px; 
                cursor: pointer; font-weight: bold; z-index: 10000;
            `;
            closeBtn.onclick = () => testContainer.remove();
            testContainer.appendChild(closeBtn);
            
            document.body.appendChild(testContainer);
            
            console.log('🎨 SVG Preview displayed! Use testSVGPreview("large", ["1","2","5","6","11"]) to test different combinations.');
            return data.data;
        } else {
            console.error('❌ Failed to generate SVG preview:', data.message);
        }
    } catch (error) {
        console.error('❌ Error testing SVG preview:', error);
    }
};