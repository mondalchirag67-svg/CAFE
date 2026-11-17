
document.addEventListener("DOMContentLoaded", function () {

  

    let ADMIN_EMAIL = "chirag05@gmail.com";

    let loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (
        !loggedInUser ||
        loggedInUser.role !== "admin" ||
        loggedInUser.email !== ADMIN_EMAIL
    ) {
        alert("Please login as Admin first (Email: chirag05@gmail.com).");
        window.location.replace("home.html");
        return;
    }

  

    function getOrders() {
        return JSON.parse(localStorage.getItem("cafeOrders")) || [];
    }

    function getUsers() {
        return JSON.parse(localStorage.getItem("cafeUsers")) || [];
    }

    function saveOrders(orders) {
        localStorage.setItem("cafeOrders", JSON.stringify(orders));
    }



    let adminName = document.getElementById("adminName");

    if (adminName) {
        adminName.textContent = loggedInUser.name || "Cafe Admin";
    }

  

    function updateStatistics() {

        let orders = getOrders();
        let users = getUsers();

        let totalOrders = orders.length;

        let pendingOrders = orders.filter(
            order => order.status === "Pending"
        ).length;

        let completedOrders = orders.filter(
            order => order.status === "Completed"
        ).length;

        let totalRevenue = orders
            .filter(order => order.status !== "Cancelled")
            .reduce((total, order) => total + Number(order.total || 0), 0);

        let totalCustomers = users.filter(
            user => user.role === "user"
        ).length;

        document.getElementById("adminTotalOrders").textContent = totalOrders;

        document.getElementById("adminPendingOrders").textContent = pendingOrders;

        document.getElementById("adminCompletedOrders").textContent = completedOrders;

        document.getElementById("adminTotalRevenue").textContent =
            "₹" + totalRevenue.toFixed(2);

        document.getElementById("adminTotalCustomers").textContent =
            totalCustomers;
    }

   

    function displayOrders() {

        let orders = getOrders();

        let tableBody = document.getElementById("adminOrdersTableBody");
        let emptyMessage = document.getElementById("adminEmptyOrders");
        let orderCount = document.getElementById("adminOrderCount");

        let searchInput = document.getElementById("orderSearch");
        let statusFilter = document.getElementById("orderStatusFilter");

        if (!tableBody) return;

        let searchText = searchInput
            ? searchInput.value.toLowerCase()
            : "";

        let selectedStatus = statusFilter
            ? statusFilter.value
            : "all";

        let filteredOrders = orders.filter(order => {

            let customerName = (order.customerName || "").toLowerCase();
            let customerEmail = (order.customerEmail || "").toLowerCase();
            let orderId = (order.id || "").toLowerCase();
            let foodName = (order.food || "").toLowerCase();

            let matchesSearch =
                customerName.includes(searchText) ||
                customerEmail.includes(searchText) ||
                orderId.includes(searchText) ||
                foodName.includes(searchText);

            let matchesStatus =
                selectedStatus === "all" ||
                order.status === selectedStatus;

            return matchesSearch && matchesStatus;
        });

        tableBody.innerHTML = "";

        if (orderCount) {
            orderCount.textContent = filteredOrders.length;
        }

        if (filteredOrders.length === 0) {

            if (emptyMessage) {
                emptyMessage.style.display = "block";
            }

            return;

        } else {

            if (emptyMessage) {
                emptyMessage.style.display = "none";
            }
        }

        filteredOrders.forEach(order => {

            let row = document.createElement("tr");

            let statusClass = (order.status || "Pending")
                .toLowerCase();

            row.innerHTML = `
                <td>${escapeHTML(order.id || "N/A")}</td>

                <td>
                    <strong>${escapeHTML(order.customerName || "N/A")}</strong>
                    <br>
                    <small>${escapeHTML(order.customerEmail || "")}</small>
                </td>

                <td>${escapeHTML(order.food || "N/A")}</td>

                <td>${escapeHTML(String(order.quantity || 0))}</td>

                <td>₹${Number(order.total || 0).toFixed(2)}</td>

                <td>${escapeHTML(order.payment || "N/A")}</td>

                <td>${escapeHTML(order.date || "N/A")}</td>

                <td>
                    <span class="status-${statusClass}">
                        ${escapeHTML(order.status || "Pending")}
                    </span>
                </td>

                <td>
                    <select
                        class="status-select"
                        data-order-id="${escapeHTML(order.id || "")}"
                    >
                        <option value="Pending" ${order.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Confirmed" ${order.status === "Confirmed" ? "selected" : ""}>Confirmed</option>
                        <option value="Preparing" ${order.status === "Preparing" ? "selected" : ""}>Preparing</option>
                        <option value="Completed" ${order.status === "Completed" ? "selected" : ""}>Completed</option>
                        <option value="Cancelled" ${order.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

   

    function escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, function (character) {

            let characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return characters[character];
        });
    }

   

    let ordersTableBody = document.getElementById("adminOrdersTableBody");

    if (ordersTableBody) {

        ordersTableBody.addEventListener("change", function (event) {

            if (!event.target.classList.contains("status-select")) {
                return;
            }

            let orderId = event.target.dataset.orderId;
            let newStatus = event.target.value;

            let orders = getOrders();

            let orderIndex = orders.findIndex(
                order => order.id === orderId
            );

            if (orderIndex === -1) {
                if (typeof window.showCafeAlert === "function") {
                    window.showCafeAlert("Order Notice", "Order not found!", { type: "error", icon: "✕" });
                } else {
                    alert("Order not found!");
                }
                return;
            }

            orders[orderIndex].status = newStatus;

            saveOrders(orders);

            if (typeof window.showCafeAlert === "function") {
                window.showCafeAlert("Status Updated", `Order #${orderId} marked as ${newStatus}!`, {
                    type: "success",
                    icon: "✓",
                    duration: 3000
                });
            } else {
                alert("Order status updated successfully!");
            }

            displayOrders();
            updateStatistics();
        });
    }

 

    let orderSearch = document.getElementById("orderSearch");

    if (orderSearch) {
        orderSearch.addEventListener("input", displayOrders);
    }

  

    let orderStatusFilter = document.getElementById("orderStatusFilter");

    if (orderStatusFilter) {
        orderStatusFilter.addEventListener("change", displayOrders);
    }



    function displayCustomers() {

        let users = getUsers();

        let tableBody = document.getElementById("adminCustomersTableBody");
        let emptyMessage = document.getElementById("adminEmptyCustomers");

        if (!tableBody) return;

        let customers = users.filter(
            user => user.role === "user"
        );

        tableBody.innerHTML = "";

        if (customers.length === 0) {

            if (emptyMessage) {
                emptyMessage.style.display = "block";
            }

            return;

        } else {

            if (emptyMessage) {
                emptyMessage.style.display = "none";
            }
        }

        customers.forEach(user => {

            let row = document.createElement("tr");

            row.innerHTML = `
                <td>${escapeHTML(user.name || "N/A")}</td>
                <td>${escapeHTML(user.email || "N/A")}</td>
                <td>User</td>
            `;

            tableBody.appendChild(row);
        });
    }

   

    let logoutButton = document.getElementById("adminLogoutBtn");

    if (logoutButton) {

        logoutButton.addEventListener("click", function () {

            let confirmLogout = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmLogout) {

                localStorage.removeItem("loggedInUser");

                window.location.replace("home.html");
            }
        });
    }

  

    
    document.querySelectorAll(".nav-menu a").forEach(link => {
        link.addEventListener("click", function() {
            let href = this.getAttribute("href");
            if (href && href.startsWith("#")) {
                document.querySelectorAll(".nav-menu a").forEach(l => l.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });

    updateStatistics();
    displayOrders();
    displayCustomers();

});
