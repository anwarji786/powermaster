document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userDetailsForm = document.getElementById('userDetailsForm');
    const itemSection = document.getElementById('itemSection');
    const itemList = document.getElementById('itemList');
    const userNav = document.getElementById('userNav');
    const orderSection = document.getElementById('orderSection');
    const orderDetails = document.getElementById('orderDetails');
    const placeOrderButton = document.getElementById('placeOrderButton');
    const searchItem = document.getElementById('searchItem'); // Search input field
    const searchButton = document.getElementById('searchButton'); // Search button
    const addSelectedButton = document.getElementById('addSelectedButton'); // Button to add selected items to cart

    let userDetails = {}; // Store user details
    let cart = []; // Items in the cart

    // Function to load products from localStorage or use fallback data
    const loadProductList = (filter = "") => {
        const products = JSON.parse(localStorage.getItem('products')) || [
            { name: "Polishing Machine", price: 500, image: "https://via.placeholder.com/150" },
            { name: "Belt Grinding Machine", price: 700, image: "https://via.placeholder.com/150" },
            { name: "Dust Collector", price: 200, image: "https://via.placeholder.com/150" },
        ];

        itemList.innerHTML = ''; // Clear the item list

        // Filter products if a search term is provided
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            itemList.innerHTML = `<p>No items found for "${filter}".</p>`;
            return;
        }

        filteredProducts.forEach((product, index) => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" style="width: 100px; height: auto; margin-right: 10px;">
                <p>${product.name} - IRS ${product.price}</p>
                <label for="quantity${index}">Quantity:</label>
                <input type="number" id="quantity${index}" min="1" value="1" style="margin-right: 15px;">
                <label for="selectItem${index}" style="display: inline; margin-left: 10px;">Select to Order</label>
                <input type="checkbox" id="selectItem${index}" data-index="${index}" style="margin-left: 5px;">
            `;
            itemList.appendChild(productDiv);
        });
    };

    // Function to add selected items to cart
    addSelectedButton.addEventListener('click', () => {
        const products = JSON.parse(localStorage.getItem('products')) || [
            { name: "Polishing Machine", price: 500, image: "https://via.placeholder.com/150" },
            { name: "Belt Grinding Machine", price: 700, image: "https://via.placeholder.com/150" },
            { name: "Dust Collector", price: 200, image: "https://via.placeholder.com/150" },
        ];

        const selectedItems = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        if (selectedItems.length === 0) {
            alert('Please select at least one item to add to the cart.');
            return;
        }

        selectedItems.forEach(item => {
            const index = item.getAttribute('data-index');
            const quantity = parseInt(document.getElementById(`quantity${index}`).value);
            if (quantity > 0) {
                cart.push({ ...products[index], quantity });
            } else {
                alert(`Please enter a valid quantity for ${products[index].name}.`);
            }
        });

        alert(`${selectedItems.length} item(s) added to your cart!`);
    });

    // Function to add individual item to cart (if "Add to Cart" button is used)
    const addToCart = (product, quantity) => {
        cart.push({ ...product, quantity }); // Add product and quantity to cart
        alert(`${quantity} x ${product.name} added to your cart!`);
    };

    // Handle form submission for user details
    userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userDetails = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
        };
        userDetailsForm.style.display = 'none';
        itemSection.style.display = 'block';
        userNav.style.display = 'flex';
        loadProductList(); // Load the products after user details are submitted
    });

    // Handle search functionality
    searchButton.addEventListener('click', () => {
        const filter = searchItem.value; // Get the search term
        loadProductList(filter); // Reload the product list with the search filter
    });

    // Handle place order functionality
    placeOrderButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Please add items to your cart.');
            return;
        }

        const order = {
            user: userDetails,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), // Calculate total price
        };

        // Save the order to localStorage for the admin
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Show confirmation message
        itemSection.style.display = 'none';
        orderSection.style.display = 'block';
        orderDetails.innerHTML = `
            <p>Order placed successfully!</p>
            <h3>Total: IRS ${order.total}</h3>
            <h3>Items:</h3>
            <ul>
                ${order.items.map(item => `
                    <li>
                        ${item.quantity} x ${item.name} @ IRS ${item.price} each - Total: IRS ${item.price * item.quantity}
                    </li>`).join('')}
            </ul>
        `;

        // Clear the cart after order placement
        cart = [];
    });

    // Initial load of product list
    loadProductList();
});
