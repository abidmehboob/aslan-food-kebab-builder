class CartManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3000/api';
        this.cart = [];
        this.ingredients = [];
        
        this.init();
    }

    async init() {
        await this.loadIngredients();
        this.loadCart();
        this.renderCart();
        this.setupEventListeners();
    }

    async loadIngredients() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/ingredients`);
            const data = await response.json();
            
            if (data.success) {
                this.ingredients = data.data.ingredients;
            }
        } catch (error) {
            console.error('Error loading ingredients:', error);
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
            <div class="cart-actions">
                <button class="action-button remove-button" onclick="cartManager.removeFromCart(${index})">
                    Remove from Cart
                </button>
            </div>
        `;

        return kebabDiv;
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