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
        await this.loadIngredients();
        this.loadCart();
        this.renderCart();
        this.setupEventListeners();
    }

    async loadIngredients() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/kebab-builder/config`);
            const data = await response.json();
            
            if (data.success) {
                this.ingredients = data.data.ingredients;
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
    }

    renderCart() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');
        const cartItemsCount = document.getElementById('cartItemsCount');

        if (this.cart.length === 0) {
            emptyCart.style.display = 'block';
            cartSummary.style.display = 'none';
            cartItemsCount.textContent = 'Your cart is empty';
            return;
        }

        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';
        cartItemsCount.textContent = `${this.cart.length} kebab${this.cart.length > 1 ? 's' : ''} in your cart`;

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

        document.getElementById('finalTotal').innerHTML = `
            <div>Total: $${grandTotal.toFixed(2)}</div>
            <div style="font-size: 0.9em; margin-top: 5px; opacity: 0.9;">
                🥩 Total Protein: ${totalProtein.toFixed(1)}g
            </div>
            <div style="font-size: 0.9em; margin-top: 3px; opacity: 0.9;">
                ⚖️ Total Weight: ${totalWeight.toFixed(0)}g
            </div>
        `;
    }

    createKebabElement(kebab, index) {
        const kebabDiv = document.createElement('div');
        kebabDiv.className = 'cart-item';
        kebabDiv.dataset.index = index;

        // Get ingredient details
        const selectedIngredientDetails = kebab.selectedIngredients.map(id => {
            return this.ingredients.find(ing => ing.id === id);
        }).filter(ing => ing);

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
                <button class="action-button" onclick="cartManager.generateKebabImages(${index})" 
                        style="background: linear-gradient(45deg, #667eea, #764ba2); color: white;">
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
        const kebab = this.cart[index];
        if (!kebab) return;

        const aiImagesContainer = document.querySelector(`#aiImages-${index} .ai-images-container`);
        if (!aiImagesContainer) return;

        // Get ingredient details
        const selectedIngredientDetails = kebab.selectedIngredients.map(id => {
            return this.ingredients.find(ing => ing.id === id);
        }).filter(ing => ing);

        // Show loading state
        aiImagesContainer.innerHTML = `
            <div class="ai-image-loading" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <div style="font-size: 2em; margin-bottom: 15px;">🎨</div>
                <h4 style="color: #667eea; margin-bottom: 10px;">Generating AI Images...</h4>
                <div style="width: 100%; height: 4px; background: #e9ecef; border-radius: 2px; overflow: hidden;">
                    <div style="height: 100%; background: linear-gradient(45deg, #667eea, #764ba2); width: 0%; animation: loading 3s ease-in-out infinite;" id="loadingBar-${index}"></div>
                </div>
                <p style="color: #666; margin-top: 10px; font-size: 0.9em;">This may take 10-15 seconds...</p>
            </div>
        `;

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
            const openKebabPrompt = this.generateOpenKebabPrompt(kebab, selectedIngredientDetails);
            const wrappedKebabPrompt = this.generateWrappedKebabPrompt(kebab, selectedIngredientDetails);

            // Call backend API to generate images
            const response = await fetch(`${this.apiBaseUrl}/kebab-builder/generate-images`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    openKebabPrompt,
                    wrappedKebabPrompt,
                    kebabData: {
                        size: kebab.size,
                        ingredients: selectedIngredientDetails.map(ing => ing.name),
                        measurements: this.getKebabMeasurements(kebab.size)
                    }
                })
            });

            const data = await response.json();

            if (data.success) {
                // Display generated images
                this.displayGeneratedImages(aiImagesContainer, data.data, kebab);
            } else {
                throw new Error(data.message || 'Failed to generate images');
            }

        } catch (error) {
            console.error('Error generating AI images:', error);
            
            // Fallback to placeholder images with detailed descriptions
            this.displayFallbackImages(aiImagesContainer, kebab, selectedIngredientDetails);
        }
    }

    generateOpenKebabPrompt(kebab, ingredients) {
        const ingredientNames = ingredients.map(ing => ing.name.toLowerCase()).join(', ');
        const tortillaType = ingredients.find(ing => ing.category === 'tortilla')?.name || 'regular tortilla';
        
        return `High-quality food photography of an open ${kebab.size} kebab wrap laid flat on a white marble surface. The ${tortillaType.toLowerCase()} is fully unwrapped and spread open, showing all ingredients clearly arranged and visible: ${ingredientNames}. Professional lighting, top-down view, ingredients are fresh and colorful, restaurant-quality presentation, ultra-detailed, 4K resolution, food styling perfection`;
    }

    generateWrappedKebabPrompt(kebab, ingredients) {
        const measurements = this.getKebabMeasurements(kebab.size);
        const tortillaType = ingredients.find(ing => ing.category === 'tortilla')?.name || 'regular tortilla';
        
        return `Professional food photography of a perfectly wrapped ${kebab.size} kebab made with ${tortillaType.toLowerCase()}, on a white background. The kebab is ${measurements.length}cm long and ${measurements.diameter}cm in diameter. White measurement lines and dimensions are clearly visible overlaid on the image showing exact size specifications. Clean, minimal, technical drawing style with precise measurements marked with thin white lines and text labels. High-quality, well-lit, commercial food photography`;
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
                     onerror="this.parentElement.innerHTML='<div style=&quot;padding: 20px; text-align: center; color: #666;&quot;><div style=&quot;font-size: 2em;&quot;>🥙</div><p>Open Kebab View</p><small>Image generation failed</small></div>'">
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

    displayFallbackImages(container, kebab, ingredients) {
        const measurements = this.getKebabMeasurements(kebab.size);
        const ingredientsList = ingredients.map(ing => ing.name).join(', ');
        
        container.innerHTML = `
            <div class="ai-image-fallback" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px; color: white; text-align: center;">
                <div style="font-size: 3em; margin-bottom: 10px;">🥙</div>
                <h5 style="margin: 0; margin-bottom: 10px;">Open Kebab Visualization</h5>
                <p style="font-size: 0.9em; margin-bottom: 10px; opacity: 0.9;">
                    ${this.capitalizeFirst(kebab.size)} ${ingredients.find(ing => ing.category === 'tortilla')?.name || 'Tortilla'}
                </p>
                <div style="background: rgba(255,255,255,0.2); border-radius: 5px; padding: 8px; font-size: 0.8em;">
                    <strong>Ingredients:</strong><br>
                    ${ingredientsList}
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

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Global instance for onclick handlers
let cartManager;

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', () => {
    cartManager = new CartManager();
});