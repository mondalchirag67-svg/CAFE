document.addEventListener("DOMContentLoaded", function () {

    let ADMIN_EMAIL = "chirag05@gmail.com";
    let ADMIN_PASSWORD = "chirag12345";

    let accountModalElement = document.getElementById("accountModal");
    let cartModalElement = document.getElementById("cartModal");

    let accountModal = (accountModalElement && typeof bootstrap !== "undefined")
        ? bootstrap.Modal.getOrCreateInstance(accountModalElement)
        : null;
    let cartModal = (cartModalElement && typeof bootstrap !== "undefined")
        ? bootstrap.Modal.getOrCreateInstance(cartModalElement)
        : null;

    let signInNavBtn = document.getElementById("signInNavBtn");
    let loginNavBtn = document.getElementById("loginNavBtn");
    let registerNavBtn = document.getElementById("registerNavBtn");
    let logoutNavBtn = document.getElementById("logoutNavBtn");
    let onlineOrderBtn = document.getElementById("onlineOrderBtn");
    let cartSignInTrigger = document.getElementById("cartSignInTrigger");
    let orderToast = document.getElementById("orderToast");

    let myProfileNav = document.getElementById("myProfileNav");
    let adminDashboardNav = document.getElementById("adminDashboardNav");

    let customerLoginForm = document.getElementById("customerLoginForm");
    let customerRegisterForm = document.getElementById("customerRegisterForm");
    let cartCheckoutForm = document.getElementById("cartCheckoutForm");

    function escapeHTML(str) {
        return String(str || "").replace(/[&<>'"]/g, function (tag) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag;
        });
    }

 
    function showCafeAlert(title, message, options) {
        options = options || {};
        if (typeof message === "undefined" && typeof title === "string") {
            message = title;
            title = "Café Notice";
        }

        let iconType = options.type || "success";
        let iconSymbol = options.icon || (iconType === "success" ? "✓" : (iconType === "error" ? "✕" : "☕"));
        let showActions = options.showActions || options.showCancel || typeof options.onOk === "function";
        let okText = options.okText || "OK";
        let cancelText = options.cancelText || "CANCEL";
        let onOk = options.onOk;
        let onCancel = options.onCancel;
        let duration = options.duration !== undefined ? options.duration : (showActions ? 0 : 3500);

        let alertEl = document.getElementById("cafeTopAlert");
        if (!alertEl) {
            alertEl = document.createElement("div");
            alertEl.id = "cafeTopAlert";
            alertEl.className = "cafe-top-alert";
            alertEl.innerHTML = `
                <div class="cafe-alert-content">
                    <div class="cafe-alert-icon" id="cafeAlertIcon">✓</div>
                    <div class="cafe-alert-text">
                        <span class="cafe-alert-title" id="cafeAlertTitle">Title</span>
                        <span class="cafe-alert-desc" id="cafeAlertDesc">Message</span>
                    </div>
                </div>
                <div class="cafe-alert-actions" id="cafeAlertActions">
                    <button type="button" class="cafe-alert-btn cafe-btn-cancel" id="cafeAlertCancelBtn">CANCEL</button>
                    <button type="button" class="cafe-alert-btn cafe-btn-ok" id="cafeAlertOkBtn">OK</button>
                </div>
            `;
            document.body.appendChild(alertEl);
        }

        let iconEl = document.getElementById("cafeAlertIcon");
        let titleEl = document.getElementById("cafeAlertTitle");
        let descEl = document.getElementById("cafeAlertDesc");
        let actionsEl = document.getElementById("cafeAlertActions");
        let cancelBtn = document.getElementById("cafeAlertCancelBtn");
        let okBtn = document.getElementById("cafeAlertOkBtn");

        iconEl.className = "cafe-alert-icon " + iconType;
        iconEl.textContent = iconSymbol;
        titleEl.textContent = title;
        descEl.textContent = message;

        if (showActions) {
            actionsEl.style.display = "flex";
            cancelBtn.textContent = cancelText;
            okBtn.textContent = okText;
            cancelBtn.style.display = options.showCancel !== false ? "inline-block" : "none";

            okBtn.onclick = function (e) {
                e.stopPropagation();
                alertEl.classList.remove("show");
                if (typeof onOk === "function") onOk();
            };

            cancelBtn.onclick = function (e) {
                e.stopPropagation();
                alertEl.classList.remove("show");
                if (typeof onCancel === "function") onCancel();
            };
        } else {
            actionsEl.style.display = "none";
        }

        if (typeof options.onClick === "function") {
            alertEl.style.cursor = "pointer";
            alertEl.onclick = function (e) {
                if (e.target !== okBtn && e.target !== cancelBtn) {
                    alertEl.classList.remove("show");
                    options.onClick();
                }
            };
        } else {
            alertEl.style.cursor = "default";
            alertEl.onclick = null;
        }

        alertEl.classList.add("show");

        clearTimeout(window._cafeTopAlertTimer);
        if (duration > 0) {
            window._cafeTopAlertTimer = setTimeout(function () {
                alertEl.classList.remove("show");
            }, duration);
        }
    }

    window.showCafeAlert = showCafeAlert;
    window.alert = function (msg) {
        showCafeAlert("Café Notice", String(msg || ""), {
            type: "info",
            icon: "☕",
            showActions: true,
            showCancel: true,
            okText: "OK",
            cancelText: "CANCEL"
        });
    };

   
    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem("loggedInUser")) || null;
        } catch (error) {
            return null;
        }
    }

    function saveCurrentUser(user) {
        let safeUser = {
            name: user.name,
            email: user.email,
            role: user.role
        };
        localStorage.setItem("loggedInUser", JSON.stringify(safeUser));
    }

    function getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem("cafeUsers")) || [];
        } catch (error) {
            return [];
        }
    }

    function getAllOrders() {
        try {
            return JSON.parse(localStorage.getItem("cafeOrders")) || [];
        } catch (error) {
            return [];
        }
    }

   
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem("cafeCart")) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem("cafeCart", JSON.stringify(cart));
        updateCartUI();
    }

    function addToCart(itemName, price) {
        if (!itemName) return;
        let cart = getCart();
        let numPrice = Number(price) || 0;
        let existing = cart.find(function (i) {
            return i.name.toLowerCase() === itemName.toLowerCase();
        });

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                name: itemName,
                price: numPrice,
                quantity: 1
            });
        }

        saveCart(cart);
        showOrderToast(itemName);
    }

    window.addToCart = addToCart;
    window.addToOrder = function (itemName, price) {
        addToCart(itemName, price);
    };

    window.updateCartQty = function (index, delta) {
        let cart = getCart();
        if (!cart[index]) return;
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
    };

    window.removeCartItem = function (index) {
        let cart = getCart();
        if (!cart[index]) return;
        cart.splice(index, 1);
        saveCart(cart);
    };

    function showOrderToast(itemName) {
        showCafeAlert(itemName + " Added!", "Added to cart! Tap to view cart & checkout →", {
            type: "success",
            icon: "✓",
            duration: 3500,
            showActions: false,
            onClick: function () {
                openCartModal();
            }
        });
    }

    function openCartModal() {
        updateCartUI();
        if (cartModal) {
            cartModal.show();
        } else if (cartModalElement && typeof bootstrap !== "undefined") {
            cartModal = bootstrap.Modal.getOrCreateInstance(cartModalElement);
            cartModal.show();
        } else {
            window.location.href = "home.html#cart";
        }
    }
    window.openCartModal = openCartModal;
    window.openOrderForm = openCartModal;

    function updateCartUI() {
        let cart = getCart();
        let totalCount = cart.reduce(function (sum, item) {
            return sum + item.quantity;
        }, 0);
        let totalAmount = cart.reduce(function (sum, item) {
            return sum + (item.price * item.quantity);
        }, 0);

       
        document.querySelectorAll("#cartBadge").forEach(function (badge) {
            badge.textContent = totalCount;
            badge.style.display = totalCount > 0 ? "inline-block" : "none";
        });

        let emptyState = document.getElementById("cartEmptyState");
        let contentState = document.getElementById("cartContentState");
        let tableBody = document.getElementById("cartItemsTableBody");
        let subtotalText = document.getElementById("cartSubtotalText");
        let grandTotalText = document.getElementById("cartGrandTotalText");
        let btnTotal = document.getElementById("cartBtnTotal");

        if (emptyState && contentState && tableBody) {
            if (cart.length === 0) {
                emptyState.style.display = "block";
                contentState.style.display = "none";
            } else {
                emptyState.style.display = "none";
                contentState.style.display = "block";

                tableBody.innerHTML = "";
                cart.forEach(function (item, index) {
                    let row = document.createElement("tr");
                    row.style.borderBottom = "1px solid #f0e6dd";
                    row.innerHTML = `
                        <td class="py-2">
                            <strong style="color: #2c1e18; font-size: 0.95rem;">${escapeHTML(item.name)}</strong>
                        </td>
                        <td class="text-center py-2" style="color: #78685d; font-size: 0.9rem;">
                            ₹${item.price}
                        </td>
                        <td class="text-center py-2">
                            <div class="d-inline-flex align-items-center gap-2 px-2 py-1 rounded" style="background: #f4ece4;">
                                <button type="button" class="btn btn-sm p-0 text-muted" style="line-height: 1; font-weight: bold; width: 18px; border:none; background:transparent;" onclick="updateCartQty(${index}, -1)">−</button>
                                <span style="font-weight: 600; font-size: 0.9rem; min-width: 16px;">${item.quantity}</span>
                                <button type="button" class="btn btn-sm p-0 text-muted" style="line-height: 1; font-weight: bold; width: 18px; border:none; background:transparent;" onclick="updateCartQty(${index}, 1)">+</button>
                            </div>
                        </td>
                        <td class="text-end py-2" style="font-weight: 700; color: #856a46; font-size: 0.95rem;">
                            ₹${item.price * item.quantity}
                        </td>
                        <td class="text-center py-2">
                            <button type="button" class="btn btn-sm p-0 text-danger" title="Remove item" style="font-size: 1.2rem; line-height: 1; border:none; background:transparent;" onclick="removeCartItem(${index})">&times;</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });

                if (subtotalText) subtotalText.textContent = "₹" + totalAmount;
                if (grandTotalText) grandTotalText.textContent = "₹" + totalAmount;
                if (btnTotal) btnTotal.textContent = "₹" + totalAmount;
            }
        }

        
        let user = getCurrentUser();
        let guestPrompt = document.getElementById("cartGuestPrompt");
        let customerFormWrapper = document.getElementById("cartCustomerFormWrapper");

        if (guestPrompt && customerFormWrapper) {
            if (user && user.role === "user") {
                guestPrompt.style.display = "none";
                customerFormWrapper.style.display = "block";

                let nameInput = document.getElementById("cartCustomerName");
                let emailInput = document.getElementById("cartCustomerEmail");
                if (nameInput) nameInput.value = user.name;
                if (emailInput) emailInput.value = user.email;
            } else {
                guestPrompt.style.display = "block";
                customerFormWrapper.style.display = "none";
            }
        }
    }

   


    function updateNavbar() {
        let user = getCurrentUser();

        if (user) {
            if (signInNavBtn) signInNavBtn.style.display = "none";
            if (loginNavBtn) loginNavBtn.style.display = "none";
            if (registerNavBtn) registerNavBtn.style.display = "none";
            if (logoutNavBtn) logoutNavBtn.style.display = "inline-block";

            
            if (myProfileNav) {
                myProfileNav.style.display =
                    user.role === "user" ? "list-item" : "none";
            }

            
            if (adminDashboardNav) {
                adminDashboardNav.style.display =
                    user.role === "admin" ? "list-item" : "none";
            }

            if (logoutNavBtn) {
                if (user.role === "admin") {
                    logoutNavBtn.textContent = "Admin Logout";
                } else {
                    logoutNavBtn.textContent = "Logout";
                }
            }

        } else {
            if (signInNavBtn) signInNavBtn.style.display = "inline-block";
            if (loginNavBtn) loginNavBtn.style.display = "inline-block";
            if (registerNavBtn) registerNavBtn.style.display = "inline-block";
            if (logoutNavBtn) logoutNavBtn.style.display = "none";

            if (myProfileNav) {
                myProfileNav.style.display = "none";
            }

            if (adminDashboardNav) {
                adminDashboardNav.style.display = "none";
            }
        }

        updateCartUI();
    }





    function showAccountTab(tabName) {
        if (!accountModal) {
            if (accountModalElement && typeof bootstrap !== "undefined") {
                accountModal = bootstrap.Modal.getOrCreateInstance(accountModalElement);
            } else {
                window.location.href = "home.html#" + (tabName === "registerTab" ? "register" : "login");
                return;
            }
        }

        accountModal.show();

        let tabButton = document.querySelector(
            '[data-bs-target="#' + tabName + '"]'
        );

        if (tabButton && typeof bootstrap !== "undefined") {
            bootstrap.Tab.getOrCreateInstance(tabButton).show();
        }
    }

    if (signInNavBtn) {
        signInNavBtn.addEventListener("click", function () {
            showAccountTab("loginTab");
        });
    }

    if (loginNavBtn) {
        loginNavBtn.addEventListener("click", function () {
            showAccountTab("loginTab");
        });
    }

    if (registerNavBtn) {
        registerNavBtn.addEventListener("click", function () {
            showAccountTab("registerTab");
        });
    }

    if (cartSignInTrigger) {
        cartSignInTrigger.addEventListener("click", function () {
            if (cartModal) cartModal.hide();
            showAccountTab("loginTab");
        });
    }

  


    if (onlineOrderBtn) {
        onlineOrderBtn.addEventListener("click", function () {
            openCartModal();
        });
    }

    if (orderToast) {
        orderToast.addEventListener("click", function () {
            openCartModal();
        });
    }




    if (logoutNavBtn) {
        logoutNavBtn.addEventListener("click", function () {
            showCafeAlert("Confirm Logout", "Are you sure you want to log out of your account?", {
                type: "warning",
                icon: "☕",
                showActions: true,
                showCancel: true,
                okText: "LOGOUT",
                cancelText: "CANCEL",
                onOk: function () {
                    localStorage.removeItem("loggedInUser");
                    updateNavbar();
                    showCafeAlert("Logged Out", "You have successfully logged out!", {
                        type: "success",
                        icon: "✓",
                        showActions: true,
                        showCancel: true,
                        okText: "OK",
                        cancelText: "CANCEL"
                    });
                }
            });
        });
    }

   


        
    if (customerRegisterForm) {
        customerRegisterForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let name = document.getElementById("customerRegisterName").value.trim();
            let email = document.getElementById("customerRegisterEmail").value.trim().toLowerCase();
            let password = document.getElementById("customerRegisterPassword").value;

            if (!name || !email || !password) {
                showCafeAlert("Registration Notice", "Please fill in all registration fields.", {
                    type: "warning",
                    icon: "☕",
                    showActions: true,
                    showCancel: true,
                    okText: "OK",
                    cancelText: "CANCEL"
                });
                return;
            }

            if (email === ADMIN_EMAIL) {
                showCafeAlert("Registration Notice", "This email address is reserved for the administrator.", {
                    type: "warning",
                    icon: "☕",
                    showActions: true,
                    showCancel: true,
                    okText: "OK",
                    cancelText: "CANCEL"
                });
                return;
            }

            let users = getAllUsers();
            let existingUser = users.find(function (user) {
                return user.email.toLowerCase() === email;
            });

            if (existingUser) {
                showCafeAlert("Account Exists", "This email is already registered. Please login.", {
                    type: "info",
                    icon: "☕",
                    showActions: true,
                    showCancel: true,
                    okText: "LOGIN NOW",
                    cancelText: "CANCEL",
                    onOk: function () {
                        showAccountTab("loginTab");
                    }
                });
                return;
            }

            let newUser = {
                name: name,
                email: email,
                password: password,
                role: "user"
            };

            users.push(newUser);
            localStorage.setItem("cafeUsers", JSON.stringify(users));

            customerRegisterForm.reset();
            showCafeAlert("Registration Successful!", "Welcome to our café! Please login with your email and password.", {
                type: "success",
                icon: "✓",
                showActions: true,
                showCancel: true,
                okText: "LOGIN NOW",
                cancelText: "CANCEL",
                onOk: function () {
                    showAccountTab("loginTab");
                }
            });
        });
    }

  
    if (customerLoginForm) {
        customerLoginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let email = document.getElementById("customerLoginEmail").value.trim().toLowerCase();
            let password = document.getElementById("customerLoginPassword").value;

            
            if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                let adminUser = {
                    name: "Cafe Admin",
                    email: ADMIN_EMAIL,
                    role: "admin"
                };

                saveCurrentUser(adminUser);
                customerLoginForm.reset();
                showCafeAlert("Admin Login Successful!", "Welcome to the Administration Dashboard.", {
                    type: "success",
                    icon: "✓",
                    duration: 1200,
                    showActions: true,
                    showCancel: true,
                    okText: "GO TO DASHBOARD",
                    cancelText: "CANCEL",
                    onOk: function () {
                        window.location.href = "admine_dasbord.html";
                    }
                });
                setTimeout(function () {
                    window.location.href = "admine_dasbord.html";
                }, 1000);
                return;
            }

           
            let users = getAllUsers();
            let user = users.find(function (u) {
                return (
                    u.email.toLowerCase() === email &&
                    u.password === password &&
                    u.role === "user"
                );
            });

            if (user) {
                saveCurrentUser(user);
                customerLoginForm.reset();
                if (accountModal) accountModal.hide();
                updateNavbar();
                updateCartUI();

                showCafeAlert("Login Successful!", "Welcome back, " + user.name + "! Happy ordering.", {
                    type: "success",
                    icon: "✓",
                    duration: 3500,
                    showActions: true,
                    showCancel: true,
                    okText: "OK",
                    cancelText: "CANCEL"
                });
            } else {
                showCafeAlert("Login Failed", "Invalid email or password. Please try again.", {
                    type: "error",
                    icon: "✕",
                    showActions: true,
                    showCancel: true,
                    okText: "TRY AGAIN",
                    cancelText: "CANCEL"
                });
            }
        });
    }


    if (cartCheckoutForm) {
        cartCheckoutForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let user = getCurrentUser();
            if (!user || user.role !== "user") {
                showCafeAlert("Sign In Required", "Please sign in as a customer to place an order.", {
                    type: "warning",
                    icon: "☕",
                    showActions: true,
                    showCancel: true,
                    okText: "SIGN IN",
                    cancelText: "CANCEL",
                    onOk: function () {
                        if (cartModal) cartModal.hide();
                        showAccountTab("loginTab");
                    }
                });
                return;
            }

            let cart = getCart();
            if (cart.length === 0) {
                showCafeAlert("Cart Empty", "Your cart is empty. Please add items to place an order.", {
                    type: "warning",
                    icon: "☕",
                    showActions: true,
                    showCancel: true,
                    okText: "OK",
                    cancelText: "CANCEL"
                });
                return;
            }

            let phone = document.getElementById("cartCustomerPhone").value.trim();
            let address = document.getElementById("cartCustomerAddress").value.trim();
            let payment = document.getElementById("cartPaymentMethod").value;

            if (!phone || !address || !payment) {
                showCafeAlert("Missing Details", "Please provide your phone number, delivery address, and payment method.", {
                    type: "warning",
                    icon: "☕",
                    showActions: true,
                    showCancel: true,
                    okText: "OK",
                    cancelText: "CANCEL"
                });
                return;
            }

            let total = cart.reduce(function (sum, item) {
                return sum + (item.price * item.quantity);
            }, 0);
            let totalQty = cart.reduce(function (sum, item) {
                return sum + item.quantity;
            }, 0);
            let foodSummary = cart.map(function (item) {
                return `${item.name} (x${item.quantity})`;
            }).join(", ");

            let order = {
                id: "ORD" + Date.now(),
                customerName: user.name,
                customerEmail: user.email,
                customerPhone: phone,
                food: foodSummary,
                items: cart,
                quantity: totalQty,
                price: cart[0]?.price || 0,
                total: total,
                address: address,
                payment: payment,
                status: "Pending",
                date: new Date().toLocaleString()
            };

            let orders = getAllOrders();
            orders.push(order);
            localStorage.setItem("cafeOrders", JSON.stringify(orders));

            localStorage.removeItem("cafeCart");
            updateCartUI();

            if (cartModal) cartModal.hide();
            cartCheckoutForm.reset();

            showCafeAlert(
                "Order Placed Successfully!",
                "Order ID: " + order.id + "\nItems: " + foodSummary + "\nTotal Amount: ₹" + total + "\nPayment: " + payment,
                {
                    type: "success",
                    icon: "✓",
                    showActions: true,
                    showCancel: true,
                    okText: "GREAT",
                    cancelText: "CLOSE"
                }
            );
        });
    }

  
    updateNavbar();
    updateCartUI();

    if (window.location.hash === "#login") {
        showAccountTab("loginTab");
    } else if (window.location.hash === "#register") {
        showAccountTab("registerTab");
    } else if (window.location.hash === "#cart" || window.location.hash === "#order") {
        openCartModal();
    }

});
