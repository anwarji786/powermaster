document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('login-section');
    const adminDashboard = document.getElementById('admin-dashboard');
    const errorMessage = document.getElementById('errorMessage');
    const adminContent = document.getElementById('adminContent');
    const viewOrders = document.getElementById('viewOrders');
    const addItems = document.getElementById('addItems');
    const editItems = document.getElementById('editItems');

    const ADMIN_EMAIL = "microenergyhealer@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    // Login functionality
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            loginSection.style.display = 'none';
            adminDashboard.style.display = 'block';
        } else {
            errorMessage.style.display = 'block';
        }
    });

    // View Orders functionality with Quantity, Price, Total for each item, and "Mark as Delivered"
    viewOrders.addEventListener('click', () => {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        if (orders.length === 0) {
            adminContent.innerHTML = `<p>No orders found.</p>`;
            return;
        }
        let ordersHtml = '<h2>Orders</h2>';
        orders.forEach((order, index) => {
            ordersHtml += `
                <div>
                    <h3>Order #${index + 1}</h3>
                    <p>User: ${order.user.name}</p>
                    <p>Phone: ${order.user.phone}</p>
                    <p>Email: ${order.user.email || "Not Provided"}</p>
                    <p>Items:</p>
                    <ul>
                        ${order.items.map(item => `
                            <li>
                                <img src="${item.image}" alt="${item.name}" style="width: 50px; height: auto;">
                                ${item.name} - Quantity: ${item.quantity}, Price: IRS ${item.price}, 
                                Total: IRS ${item.quantity * item.price}
                            </li>`).join('')}
                    </ul>
                    <p>Total Order Amount: IRS ${order.total}</p>
                    <button class="mark-delivered" data-index="${index}">Mark as Delivered</button>
                </div><hr>`;
        });
        adminContent.innerHTML = ordersHtml;

        const deliveredButtons = document.querySelectorAll('.mark-delivered');
        deliveredButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const orderIndex = e.target.getAttribute('data-index');
                orders.splice(orderIndex, 1); // Remove the selected order
                localStorage.setItem('orders', JSON.stringify(orders)); // Update localStorage
                viewOrders.click(); // Refresh the order list
            });
        });
    });

    // Add Items functionality
    addItems.addEventListener('click', () => {
        adminContent.innerHTML = `
            <h2>Add Items</h2>
            <form id="addItemForm">
                <label for="itemName">Item Name:</label>
                <input type="text" id="itemName" required>
                <label for="itemPrice">Item Price (IRS):</label>
                <input type="number" id="itemPrice" required>
                <label for="itemImage">Image URL:</label>
                <input type="text" id="itemImage" required>
                <button type="submit">Add Item</button>
            </form>
            <p id="successMessage" style="display: none; color: green;">Item added successfully!</p>
        `;

        const addItemForm = document.getElementById('addItemForm');
        addItemForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('itemName').value;
            const price = parseFloat(document.getElementById('itemPrice').value);
            const image = document.getElementById('itemImage').value;

            let products = JSON.parse(localStorage.getItem('products')) || [];
            products.push({ name, price, image });
            localStorage.setItem('products', JSON.stringify(products));
            document.getElementById('successMessage').style.display = 'block';
        });
    });

    // Edit Items functionality
    editItems.addEventListener('click', () => {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        if (products.length === 0) {
            adminContent.innerHTML = `<p>No items available to edit.</p>`;
            return;
        }
        let editHtml = '<h2>Edit Items</h2>';
        products.forEach((product, index) => {
            editHtml += `
                <div>
                    <p>${product.name} - IRS ${product.price}</p>
                    <button id="editItem${index}">Edit</button>
                    <button id="deleteItem${index}" style="background-color: red; color: white;">Delete</button>
                </div>`;
        });
        adminContent.innerHTML = editHtml;

        products.forEach((product, index) => {
            // Edit functionality
            document.getElementById(`editItem${index}`).addEventListener('click', () => {
                adminContent.innerHTML = `
                    <h2>Edit Item</h2>
                    <form id="editItemForm">
                        <label for="editItemName">Item Name:</label>
                        <input type="text" id="editItemName" value="${product.name}" required>
                        <label for="editItemPrice">Item Price (IRS):</label>
                        <input type="number" id="editItemPrice" value="${product.price}" required>
                        <label for="editItemImage">Image URL:</label>
                        <input type="text" id="editItemImage" value="${product.image}" required>
                        <button type="submit">Save Changes</button>
                    </form>
                `;

                const editItemForm = document.getElementById('editItemForm');
                editItemForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    products[index] = {
                        name: document.getElementById('editItemName').value,
                        price: parseFloat(document.getElementById('editItemPrice').value),
                        image: document.getElementById('editItemImage').value,
                    };
                    localStorage.setItem('products', JSON.stringify(products));
                    adminContent.innerHTML = `<p style="color: green;">Item updated successfully!</p>`;
                    setTimeout(() => editItems.click(), 2000); // Refresh Edit Items section
                });
            });

            // Delete functionality
            document.getElementById(`deleteItem${index}`).addEventListener('click', () => {
                products.splice(index, 1); // Remove item
                localStorage.setItem('products', JSON.stringify(products)); // Save changes
                adminContent.innerHTML = `<p style="color: green;">Item deleted successfully!</p>`;
                setTimeout(() => editItems.click(), 2000); // Refresh Edit Items section
            });
        });
    });
});
