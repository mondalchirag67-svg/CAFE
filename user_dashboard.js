
document.addEventListener("DOMContentLoaded", function () {

  

    function getCurrentUser() {

        return JSON.parse(localStorage.getItem("loggedInUser")) || null;

    }


    

    let user = getCurrentUser();

    

    if (!user || user.role !== "user") {

        window.location.replace("home.html");

        return;

    }


   

    function getAllOrders() {

        return JSON.parse(localStorage.getItem("cafeOrders")) || [];

    }


   

    function getUserOrders() {

        let allOrders = getAllOrders();

        return allOrders.filter(function (order) {

            return (
                order.customerEmail &&
                user.email &&
                order.customerEmail.toLowerCase() === user.email.toLowerCase()
            );

        });

    }


  

    function displayProfile() {

        let welcomeName = document.getElementById("welcomeName");

        let profileName = document.getElementById("profileName");

        let profileEmail = document.getElementById("profileEmail");

        let profileInitial = document.getElementById("profileInitial");


        if (welcomeName) {

            welcomeName.textContent = user.name;

        }

        if (profileName) {

            profileName.textContent = user.name;

        }

        if (profileEmail) {

            profileEmail.textContent = user.email;

        }

        if (profileInitial) {

            profileInitial.textContent = user.name.charAt(0).toUpperCase();

        }

    }


  
    function displayStatistics() {

        let orders = getUserOrders();

        

        let totalOrders = orders.length;


       

        let totalSpent = orders.reduce(function (total, order) {

            return total + Number(order.total || 0);

        }, 0);


        

        let pendingOrders = orders.filter(function (order) {

            return String(order.status).toLowerCase() === "pending";

        }).length;


        

        let totalOrdersElement = document.getElementById("totalOrders");

        let totalSpentElement = document.getElementById("totalSpent");

        let pendingOrdersElement = document.getElementById("pendingOrders");


        if (totalOrdersElement) {
            totalOrdersElement.textContent = totalOrders;
        }

        if (totalSpentElement) {

            totalSpentElement.textContent =
                "₹" + totalSpent.toLocaleString("en-IN");

        }

        if (pendingOrdersElement) {
            pendingOrdersElement.textContent = pendingOrders;
        }

    }


   

    function displayOrders() {

        let orders = getUserOrders();

        let tableBody = document.getElementById("ordersTableBody");

        let emptyOrders = document.getElementById("emptyOrders");

        let orderCountLabel = document.getElementById("orderCountLabel");


        if (!tableBody || !emptyOrders || !orderCountLabel) {
            return;
        }


        

        tableBody.innerHTML = "";


        

        orderCountLabel.textContent =
            orders.length + (orders.length === 1 ? " order" : " orders");


       

        if (orders.length === 0) {

            emptyOrders.style.display = "block";

            return;

        }


        emptyOrders.style.display = "none";


       

        let recentOrders = [...orders].reverse();


        recentOrders.forEach(function (order) {

            let row = document.createElement("tr");


            

            let orderId = document.createElement("td");

            orderId.textContent = order.id || "N/A";


            

            let foodName = document.createElement("td");

            foodName.textContent = order.food || "N/A";



            let orderDate = document.createElement("td");

            orderDate.textContent = order.date || "N/A";


            

            let orderTotal = document.createElement("td");

            orderTotal.textContent =
                "₹" + Number(order.total || 0).toLocaleString("en-IN");


           

            let orderStatus = document.createElement("td");

            let statusBadge = document.createElement("span");

            let status = String(order.status || "Pending");

            statusBadge.textContent = status;

            statusBadge.classList.add("status-badge");


            

            let normalizedStatus = status.toLowerCase();

            if (normalizedStatus === "completed") {

                statusBadge.classList.add("status-completed");

            } else if (normalizedStatus === "cancelled") {

                statusBadge.classList.add("status-cancelled");

            } else {

                statusBadge.classList.add("status-pending");

            }


            orderStatus.appendChild(statusBadge);


            

            row.appendChild(orderId);

            row.appendChild(foodName);

            row.appendChild(orderDate);

            row.appendChild(orderTotal);

            row.appendChild(orderStatus);


            // Add row to table

            tableBody.appendChild(row);

        });

    }


  

    let logoutBtn = document.getElementById("dashboardLogoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            if (typeof window.showCafeAlert === "function") {
                window.showCafeAlert("Confirm Logout", "Are you sure you want to log out of your account?", {
                    type: "warning",
                    icon: "☕",
                    showActions: true,
                    showCancel: true,
                    okText: "LOGOUT",
                    cancelText: "CANCEL",
                    onOk: function () {
                        localStorage.removeItem("loggedInUser");
                        window.showCafeAlert("Logged Out", "You have successfully logged out!", {
                            type: "success",
                            icon: "✓",
                            duration: 1500,
                            showActions: true,
                            showCancel: true,
                            okText: "OK",
                            cancelText: "CANCEL",
                            onOk: function () {
                                window.location.replace("home.html");
                            },
                            onCancel: function () {
                                window.location.replace("home.html");
                            }
                        });
                        setTimeout(function () {
                            window.location.replace("home.html");
                        }, 1200);
                    }
                });
            } else {
                localStorage.removeItem("loggedInUser");
                window.location.replace("home.html");
            }

        });

    }


 

    function initializeDashboard() {

        displayProfile();

        displayStatistics();

        displayOrders();

    }


    initializeDashboard();

});
