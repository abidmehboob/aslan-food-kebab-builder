class KebabBuilder {
    constructor() {
        // Environment-aware API URL
        this.apiBaseUrl = this.getApiBaseUrl();
        this.selectedSize = '';
        this.selectedIngredients = [];
        this.selectedTortilla = null; // Track single tortilla selection
        this.ingredients = [];
        this.basePrices = {};
        this.currentPrice = {
            base: 0,
            ingredients: 0,
            total: 0
        };
        this.currentProtein = 0;
        this.currentWeight = 0;
        
        this.init();
    }

    async init() {
        console.log('Init started...');
        await this.loadBuilderConfig();
        console.log('Builder config loaded');
        await this.loadPopularCombos();
        console.log('Popular combos loaded');
        this.setupEventListeners();
        console.log('Event listeners setup');
        this.hideLoading();
        console.log('Loading hidden');
        
        // Initialize empty preview
        this.generatePreview();
    }

    async loadBuilderConfig() {
        try {
            console.log('Fetching config from:', `${this.apiBaseUrl}/kebab-builder/config`);
            const response = await fetch(`${this.apiBaseUrl}/kebab-builder/config`);
            console.log('Response received:', response.status);
            const data = await response.json();
            console.log('Data received:', data);
            
            if (data.success) {
                this.ingredients = data.data.ingredients;
                this.basePrices = data.data.basePrices;
                console.log('About to render size options:', data.data.sizes);
                this.renderSizes(data.data.sizes);
                console.log('About to render ingredients');
                this.renderIngredients(data.data.ingredients, data.data.ingredientCategories);
                console.log('Rendering complete');
            } else {
                console.error('API returned unsuccessful response:', data);
            }
        } catch (error) {
            console.error('Error loading builder config:', error);
            this.showError('Failed to load ingredients. Please refresh the page.');
        }
    }

    async loadPopularCombos() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/kebab-builder/popular`);
            const data = await response.json();
            
            if (data.success) {
                this.renderPopularCombos(data.data);
            }
        } catch (error) {
            console.error('Error loading popular combos:', error);
        }
    }

    renderSizes(sizes) {
        const sizeOptions = document.getElementById('sizeOptions');
        sizeOptions.innerHTML = '';

        sizes.forEach(size => {
            const sizeDiv = document.createElement('div');
            sizeDiv.className = 'size-option';
            sizeDiv.dataset.size = size;
            
            const sizeInfo = this.basePrices[size];
            const price = typeof sizeInfo === 'object' ? sizeInfo.price : sizeInfo;
            const dimensions = typeof sizeInfo === 'object' ? `${sizeInfo.length}cm x ${sizeInfo.width}cm` : '';
            const weight = typeof sizeInfo === 'object' ? `${sizeInfo.weight}g` : '';
            const serves = typeof sizeInfo === 'object' ? `Serves ${sizeInfo.serves}` : '';
            const description = typeof sizeInfo === 'object' ? sizeInfo.description : '';
            
            sizeDiv.innerHTML = `
                <div style="font-weight: bold; text-transform: capitalize; margin-bottom: 4px;">${size}</div>
                <div style="color: #666; font-size: 0.85em; margin-bottom: 2px;">📏 ${dimensions}</div>
                <div style="color: #666; font-size: 0.85em; margin-bottom: 2px;">⚖️ ${weight} • ${serves}</div>
                <div style="color: #28a745; font-weight: bold; font-size: 0.9em;">$${price.toFixed(2)}</div>
                <div style="color: #888; font-size: 0.75em; font-style: italic; margin-top: 4px;">${description}</div>
            `;
            
            sizeDiv.addEventListener('click', () => this.selectSize(size));
            sizeOptions.appendChild(sizeDiv);
        });
    }

    renderIngredients(ingredients, categories) {
        console.log('renderIngredients called with', ingredients.length, 'ingredients');
        
        const debugDiv = document.getElementById('debugInfo');
        if (debugDiv) {
            debugDiv.innerHTML = `Debug: Rendering ${ingredients.length} ingredients across ${categories.length} categories`;
        }
        
        const container = document.getElementById('ingredientsContainer');
        container.innerHTML = '';

        // Add tortilla requirement notice for tortilla category
        const tortillaCategory = categories.find(cat => cat === 'tortilla');
        if (tortillaCategory) {
            const notice = document.createElement('div');
            notice.className = 'tortilla-required';
            notice.innerHTML = '⚠️ Please select ONE tortilla type - it\'s the base for your kebab!';
            container.appendChild(notice);
        }

        categories.forEach(category => {
            const categoryIngredients = ingredients.filter(ing => ing.category === category);
            
            if (categoryIngredients.length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'ingredient-category';
                
                categoryDiv.innerHTML = `
                    <h4 class="category-title">${this.capitalizeFirst(category)}</h4>
                    <div class="ingredients-grid" id="category-${category}">
                    </div>
                `;
                
                container.appendChild(categoryDiv);
                
                const gridDiv = categoryDiv.querySelector(`#category-${category}`);
                
                categoryIngredients.forEach(ingredient => {
                    const ingredientDiv = document.createElement('div');
                    ingredientDiv.className = 'ingredient-item';
                    ingredientDiv.dataset.ingredientId = ingredient.id;
                    ingredientDiv.dataset.category = ingredient.category;
                    
                    const priceText = ingredient.price === 0 ? 'FREE' : `+$${ingredient.price.toFixed(2)}`;
                    const inputType = ingredient.category === 'tortilla' ? 'radio' : 'checkbox';
                    const inputName = ingredient.category === 'tortilla' ? 'tortilla-selection' : '';
                    
                    ingredientDiv.innerHTML = `
                        <input type="${inputType}" ${inputName ? `name="${inputName}"` : ''} class="ingredient-checkbox" id="ing-${ingredient.id}">
                        <img src="${ingredient.image}" alt="${ingredient.name}" class="ingredient-image" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22><rect width=%22200%22 height=%22150%22 fill=%22%23f0f0f0%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2214%22 fill=%22%23999%22>${ingredient.name}</text></svg>'">
                        <div class="ingredient-info">
                            <div class="ingredient-name">${ingredient.name}</div>
                            <div class="ingredient-description">${ingredient.description}</div>
                            <div class="ingredient-protein">🥩 ${ingredient.protein}g protein • ⚖️ ${ingredient.weight}g</div>
                        </div>
                        <div class="ingredient-price">${priceText}</div>
                    `;
                    
                    ingredientDiv.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        console.log('Ingredient clicked:', ingredient.name, ingredient.id);
                        this.toggleIngredient(ingredient.id);
                    });
                    gridDiv.appendChild(ingredientDiv);
                });
            }
        });
    }

    renderPopularCombos(combos) {
        const container = document.getElementById('popularCombos');
        container.innerHTML = '';

        combos.forEach(combo => {
            const comboDiv = document.createElement('div');
            comboDiv.className = 'combo-card';
            
            comboDiv.innerHTML = `
                <div class="combo-name">${combo.name}</div>
                <div class="combo-price">$${combo.estimatedPrice.toFixed(2)}</div>
                <div style="clear: both; margin-top: 8px; color: #666; font-size: 0.9em;">
                    ${combo.description}
                </div>
                <div style="margin-top: 10px; font-size: 0.85em; color: #888;">
                    Size: ${combo.size} • ${this.getIngredientNames(combo.ingredients).join(', ')}
                </div>
            `;
            
            comboDiv.addEventListener('click', () => this.selectPopularCombo(combo));
            container.appendChild(comboDiv);
        });
    }

    getIngredientNames(ingredientIds) {
        return ingredientIds.map(id => {
            const ingredient = this.ingredients.find(ing => ing.id === id);
            return ingredient ? ingredient.name : '';
        }).filter(name => name);
    }

    selectSize(size) {
        // Remove previous selection
        document.querySelectorAll('.size-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Add selection to clicked size
        document.querySelector(`[data-size="${size}"]`).classList.add('selected');
        
        this.selectedSize = size;
        this.updatePriceCalculation();
        this.generatePreview(); // Update kebab preview when size changes
    }

    toggleIngredient(ingredientId) {
        console.log('toggleIngredient called with ID:', ingredientId);
        
        // Add visible debug info
        const debugDiv = document.getElementById('debugInfo');
        if (debugDiv) {
            debugDiv.innerHTML = `Debug: toggleIngredient called with ID: ${ingredientId} at ${new Date().toLocaleTimeString()}`;
        }
        
        const ingredient = this.ingredients.find(ing => ing.id === ingredientId);
        const ingredientDiv = document.querySelector(`[data-ingredient-id="${ingredientId}"]`);
        
        if (!ingredient) {
            console.error('Ingredient not found:', ingredientId);
            return;
        }
        
        if (!ingredientDiv) {
            console.error('Ingredient div not found:', ingredientId);
            return;
        }
        
        const checkbox = ingredientDiv.querySelector('.ingredient-checkbox');
        
        if (!checkbox) {
            console.error('Checkbox not found for ingredient:', ingredientId);
            return;
        }
        
        if (ingredient.category === 'tortilla') {
            // Handle single tortilla selection
            if (this.selectedTortilla === ingredientId) {
                // Deselect current tortilla
                this.selectedTortilla = null;
                this.selectedIngredients = this.selectedIngredients.filter(id => id !== ingredientId);
                ingredientDiv.classList.remove('selected');
                checkbox.checked = false;
                
                // Remove selection from all tortillas
                document.querySelectorAll('[data-category="tortilla"]').forEach(el => {
                    el.classList.remove('selected');
                    el.querySelector('.ingredient-checkbox').checked = false;
                });
            } else {
                // Remove previous tortilla selection
                if (this.selectedTortilla) {
                    this.selectedIngredients = this.selectedIngredients.filter(id => id !== this.selectedTortilla);
                    document.querySelectorAll('[data-category="tortilla"]').forEach(el => {
                        el.classList.remove('selected');
                        el.querySelector('.ingredient-checkbox').checked = false;
                    });
                }
                
                // Select new tortilla
                this.selectedTortilla = ingredientId;
                this.selectedIngredients.push(ingredientId);
                ingredientDiv.classList.add('selected');
                checkbox.checked = true;
            }
        } else {
            // Handle regular ingredient selection (multiple allowed)
            if (this.selectedIngredients.includes(ingredientId)) {
                // Remove ingredient
                this.selectedIngredients = this.selectedIngredients.filter(id => id !== ingredientId);
                ingredientDiv.classList.remove('selected');
                checkbox.checked = false;
            } else {
                // Add ingredient
                this.selectedIngredients.push(ingredientId);
                ingredientDiv.classList.add('selected');
                checkbox.checked = true;
            }
        }
        
        console.log('Selected ingredients:', this.selectedIngredients);
        
        // Update preview immediately with current selection
        this.updateKebabPreviewDirect();
        
        this.updatePriceCalculation();
        this.generatePreview(); // Update kebab preview when ingredients change
    }

    async updatePriceCalculation() {
        if (!this.selectedSize) {
            this.resetPriceDisplay();
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/kebab-builder/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    size: this.selectedSize,
                    selectedIngredients: this.selectedIngredients
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.currentPrice = {
                    base: data.data.basePrice,
                    ingredients: data.data.ingredientsPrice,
                    total: data.data.totalPrice
                };
                
                this.updatePriceDisplay(data.data);
                this.updateKebabPreview(data.data.selectedIngredients);
            }
        } catch (error) {
            console.error('Error calculating price:', error);
        }
    }

    updatePriceDisplay(priceData) {
        document.getElementById('basePrice').textContent = `$${priceData.basePrice.toFixed(2)}`;
        document.getElementById('ingredientsPrice').textContent = `$${priceData.ingredientsPrice.toFixed(2)}`;
        document.getElementById('totalPrice').textContent = `$${priceData.totalPrice.toFixed(2)}`;
        document.getElementById('totalProtein').textContent = `${priceData.totalProtein}g`;
        document.getElementById('totalWeight').textContent = `${priceData.totalWeight}g`;
        
        this.currentProtein = priceData.totalProtein;
        this.currentWeight = priceData.totalWeight;
        
        const orderButton = document.getElementById('orderButton');
        orderButton.textContent = `Add to Cart - $${priceData.totalPrice.toFixed(2)}`;
        orderButton.disabled = false;
    }

    resetPriceDisplay() {
        document.getElementById('basePrice').textContent = '$0.00';
        document.getElementById('ingredientsPrice').textContent = '$0.00';
        document.getElementById('totalPrice').textContent = '$0.00';
        document.getElementById('totalProtein').textContent = '0g';
        document.getElementById('totalWeight').textContent = '0g';
        
        this.currentProtein = 0;
        this.currentWeight = 0;
        
        const orderButton = document.getElementById('orderButton');
        orderButton.textContent = 'Add to Cart - $0.00';
        orderButton.disabled = true;
        
        this.updateKebabPreview([]);
    }

    async generatePreview() {
        if (!this.selectedSize || this.selectedIngredients.length === 0) {
            // Clear preview if no size or ingredients selected
            const previewContainer = document.getElementById('kebabPreview');
            if (previewContainer) {
                previewContainer.innerHTML = '<p style="color: #666; text-align: center; font-style: italic;">Select a size and ingredients to see your kebab preview</p>';
            }
            return;
        }

        try {
            const response = await fetch('/api/ingredients/preview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    size: this.selectedSize,
                    ingredients: this.selectedIngredients
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.updatePreviewDisplay(data);
            } else {
                console.error('Failed to generate kebab preview');
            }
        } catch (error) {
            console.error('Error generating kebab preview:', error);
        }
    }

    updatePreviewDisplay(previewData) {
        const previewContainer = document.getElementById('kebabPreview');
        if (!previewContainer) return;

        const sizeInfo = this.basePrices[this.selectedSize];
        const dimensions = typeof sizeInfo === 'object' ? `${sizeInfo.length}cm x ${sizeInfo.width}cm` : this.selectedSize;
        
        previewContainer.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px;">
                <h4 style="margin: 0 0 5px 0; color: #333;">Your ${this.selectedSize.charAt(0).toUpperCase() + this.selectedSize.slice(1)} Kebab</h4>
                <p style="margin: 0; color: #666; font-size: 0.9em;">📏 ${dimensions}</p>
            </div>
            <div style="display: flex; justify-content: center; margin-bottom: 15px;">
                ${previewData.svg}
            </div>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; font-size: 0.9em;">
                <p style="margin: 0 0 8px 0; font-weight: bold; color: #333;">Ingredients (${previewData.ingredientCount}):</p>
                <p style="margin: 0; color: #666; line-height: 1.4;">${previewData.description}</p>
            </div>
        `;
    }

    updateKebabPreviewDirect() {
        const container = document.getElementById('selectedItems');
        
        if (!this.selectedSize || this.selectedIngredients.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Select ingredients to see your kebab</p>';
            return;
        }
        
        // Get the actual ingredient objects from IDs
        const selectedIngredientObjects = this.selectedIngredients.map(id => 
            this.ingredients.find(ing => ing.id === id)
        ).filter(ing => ing); // Filter out any null/undefined
        
        console.log('Updating preview with ingredients:', selectedIngredientObjects);
        this.updateKebabPreview(selectedIngredientObjects);
    }

    updateKebabPreview(selectedIngredients) {
        const container = document.getElementById('selectedItems');
        
        if (!this.selectedSize || selectedIngredients.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">Select ingredients to see your kebab</p>';
            return;
        }
        
        let html = `<div class="selected-item">
            <span><strong>${this.capitalizeFirst(this.selectedSize)} Kebab</strong></span>
            <span>$${this.currentPrice.base.toFixed(2)}</span>
        </div>`;
        
        // Group ingredients by category for better display
        const categorizedIngredients = {};
        selectedIngredients.forEach(ingredient => {
            if (!categorizedIngredients[ingredient.category]) {
                categorizedIngredients[ingredient.category] = [];
            }
            categorizedIngredients[ingredient.category].push(ingredient);
        });

        // Display ingredients by category
        Object.keys(categorizedIngredients).forEach(category => {
            categorizedIngredients[category].forEach(ingredient => {
                const priceText = ingredient.price === 0 ? 'FREE' : `+$${ingredient.price.toFixed(2)}`;
                html += `
                    <div class="selected-item">
                        <span>
                            <img src="${ingredient.image}" alt="${ingredient.name}" 
                                 style="width: 24px; height: 18px; object-fit: cover; border-radius: 2px; margin-right: 8px; vertical-align: middle;"
                                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2218%22><rect width=%2224%22 height=%2218%22 fill=%22%23ddd%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%228%22 fill=%22%23666%22>🍴</text></svg>'">
                            ${ingredient.name} <small>(${ingredient.protein}g protein, ${ingredient.weight}g)</small>
                        </span>
                        <span>${priceText}</span>
                    </div>
                `;
            });
        });
        
        container.innerHTML = html;
        this.updateCartCount();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.selectedIngredients.length + (this.selectedSize ? 1 : 0);
        cartCount.textContent = totalItems;
    }

    selectPopularCombo(combo) {
        // Reset current selection
        this.selectedIngredients = [];
        this.selectedTortilla = null;
        document.querySelectorAll('.ingredient-item').forEach(el => {
            el.classList.remove('selected');
            el.querySelector('.ingredient-checkbox').checked = false;
        });
        
        // Select size
        this.selectSize(combo.size);
        
        // Select ingredients
        combo.ingredients.forEach(ingredientId => {
            this.toggleIngredient(ingredientId);
        });
    }

    async placeOrder() {
        // Check for tortilla requirement
        if (!this.selectedTortilla) {
            alert('Please select a tortilla type - it\'s required as the base for your kebab!');
            return;
        }

        if (!this.selectedSize || this.selectedIngredients.length === 0) {
            alert('Please select a size and at least one ingredient.');
            return;
        }

        // Store order in localStorage for cart page
        const orderData = {
            size: this.selectedSize,
            selectedIngredients: this.selectedIngredients,
            selectedTortilla: this.selectedTortilla,
            pricing: this.currentPrice,
            protein: this.currentProtein,
            weight: this.currentWeight,
            timestamp: Date.now()
        };

        let cart = JSON.parse(localStorage.getItem('kebabCart') || '[]');
        cart.push(orderData);
        localStorage.setItem('kebabCart', JSON.stringify(cart));

        alert(`Kebab added to cart!\nTotal: $${this.currentPrice.total.toFixed(2)}\nProtein: ${this.currentProtein}g\nWeight: ${this.currentWeight}g`);
        
        // Redirect to cart page
        window.location.href = 'cart.html';
    }

    resetBuilder() {
        this.selectedSize = '';
        this.selectedIngredients = [];
        this.selectedTortilla = null;
        this.currentProtein = 0;
        this.currentWeight = 0;
        
        document.querySelectorAll('.size-option').forEach(el => {
            el.classList.remove('selected');
        });
        
        document.querySelectorAll('.ingredient-item').forEach(el => {
            el.classList.remove('selected');
            el.querySelector('.ingredient-checkbox').checked = false;
        });
        
        this.resetPriceDisplay();
    }

    setupEventListeners() {
        document.getElementById('orderButton').addEventListener('click', () => {
            this.placeOrder();
        });
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('builder').style.display = 'grid';
    }

    showError(message) {
        document.getElementById('loading').innerHTML = `<p style="color: red;">${message}</p>`;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getApiBaseUrl() {
        // Automatically detect the correct API URL based on environment
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            // Development environment
            return 'http://localhost:3000/api';
        } else if (hostname.includes('onrender.com')) {
            // Render.com deployment - use same domain
            return `${protocol}//${hostname}/api`;
        } else {
            // Other production environments - use same domain
            return `${protocol}//${hostname}/api`;
        }
    }
}

// Initialize the kebab builder when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new KebabBuilder();
});