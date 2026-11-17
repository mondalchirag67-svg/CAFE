

(function () {
    
    if (!document.getElementById("cafe-alert-styles")) {
        const style = document.createElement("style");
        style.id = "cafe-alert-styles";
        style.textContent = `
            .cafe-top-alert-container {
                position: fixed;
                top: 24px;
                left: 50%;
                transform: translate(-50%, -120px);
                background-color: #241712;
                color: #ffffff;
                padding: 14px 22px;
                border-radius: 18px;
                box-shadow: 0 16px 45px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(209, 191, 177, 0.22);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 16px;
                z-index: 9999999;
                opacity: 0;
                pointer-events: none;
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
                max-width: 90vw;
                min-width: 320px;
                box-sizing: border-box;
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .cafe-top-alert-container.show {
                transform: translate(-50%, 0);
                opacity: 1;
                pointer-events: auto;
            }

            .cafe-top-alert-content {
                display: flex;
                align-items: center;
                gap: 14px;
                flex-grow: 1;
            }

            .cafe-top-alert-icon {
                width: 34px;
                height: 34px;
                min-width: 34px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.05rem;
                font-weight: 800;
                color: #ffffff;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
            }

            .cafe-top-alert-icon.success {
                background-color: #27ae60;
                box-shadow: 0 3px 10px rgba(39, 174, 96, 0.4);
            }

            .cafe-top-alert-icon.info {
                background-color: #856a46;
                box-shadow: 0 3px 10px rgba(133, 106, 70, 0.4);
            }

            .cafe-top-alert-icon.warning {
                background-color: #d35400;
                box-shadow: 0 3px 10px rgba(211, 84, 0, 0.4);
            }

            .cafe-top-alert-icon.error {
                background-color: #c0392b;
                box-shadow: 0 3px 10px rgba(192, 57, 43, 0.4);
            }

            .cafe-top-alert-text {
                display: flex;
                flex-direction: column;
                line-height: 1.35;
                text-align: left;
            }

            .cafe-top-alert-title {
                font-weight: 700;
                font-size: 0.98rem;
                color: #ffffff;
                letter-spacing: -0.01em;
            }

            .cafe-top-alert-desc {
                font-size: 0.84rem;
                color: #d1bfb1;
                margin-top: 2px;
                white-space: pre-line;
                word-break: break-word;
            }

            .cafe-top-alert-actions {
                display: flex;
                align-items: center;
                gap: 10px;
                flex-shrink: 0;
                margin-left: 10px;
            }

            .cafe-top-alert-btn {
                padding: 8px 18px;
                border-radius: 20px;
                font-size: 0.74rem;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                cursor: pointer;
                border: none;
                transition: all 0.25s ease;
                line-height: 1.2;
                font-family: inherit;
            }

            .cafe-top-alert-cancel {
                background-color: rgba(255, 255, 255, 0.12);
                color: #d1bfb1;
                border: 1px solid rgba(209, 191, 177, 0.35);
            }

            .cafe-top-alert-cancel:hover {
                background-color: rgba(255, 255, 255, 0.22);
                color: #ffffff;
                transform: translateY(-1px);
            }

            .cafe-top-alert-ok {
                background-color: #856a46;
                color: #ffffff !important;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.25);
            }

            .cafe-top-alert-ok:hover {
                background-color: #553925;
                color: #ffffff !important;
                transform: translateY(-1px);
                box-shadow: 0 5px 14px rgba(0, 0, 0, 0.35);
            }

            @media (max-width: 600px) {
                .cafe-top-alert-container {
                    top: 15px;
                    width: 92vw;
                    min-width: unset;
                    flex-direction: column;
                    align-items: flex-start;
                    padding: 14px 18px;
                    gap: 12px;
                }
                .cafe-top-alert-actions {
                    width: 100%;
                    justify-content: flex-end;
                    margin-left: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

   
    window.showCafeAlert = function (title, message, options) {
        options = options || {};
        if (typeof message === "undefined" && typeof title === "string") {
            message = title;
            title = "Café Notice";
        }

        let iconType = options.type || "success";
        let iconSymbol = options.icon || (iconType === "success" ? "✓" : (iconType === "error" ? "✕" : (iconType === "warning" ? "!" : "☕")));
        let showActions = options.showActions || options.showCancel || typeof options.onOk === "function";
        let okText = options.okText || "OK";
        let cancelText = options.cancelText || "CANCEL";
        let onOk = options.onOk;
        let onCancel = options.onCancel;
        let duration = options.duration !== undefined ? options.duration : (showActions ? 0 : 3500);

        let alertEl = document.getElementById("cafeTopAlertContainer");
        if (!alertEl) {
            alertEl = document.createElement("div");
            alertEl.id = "cafeTopAlertContainer";
            alertEl.className = "cafe-top-alert-container";
            alertEl.innerHTML = `
                <div class="cafe-top-alert-content">
                    <div class="cafe-top-alert-icon" id="cafeTopAlertIcon">✓</div>
                    <div class="cafe-top-alert-text">
                        <span class="cafe-top-alert-title" id="cafeTopAlertTitle"></span>
                        <span class="cafe-top-alert-desc" id="cafeTopAlertDesc"></span>
                    </div>
                </div>
                <div class="cafe-top-alert-actions" id="cafeTopAlertActions">
                    <button type="button" class="cafe-top-alert-btn cafe-top-alert-cancel" id="cafeTopAlertCancelBtn">CANCEL</button>
                    <button type="button" class="cafe-top-alert-btn cafe-top-alert-ok" id="cafeTopAlertOkBtn">OK</button>
                </div>
            `;
            document.body.appendChild(alertEl);
        }

        let iconEl = document.getElementById("cafeTopAlertIcon");
        let titleEl = document.getElementById("cafeTopAlertTitle");
        let descEl = document.getElementById("cafeTopAlertDesc");
        let actionsEl = document.getElementById("cafeTopAlertActions");
        let cancelBtn = document.getElementById("cafeTopAlertCancelBtn");
        let okBtn = document.getElementById("cafeTopAlertOkBtn");

        iconEl.className = "cafe-top-alert-icon " + iconType;
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
    };

   
    window.alert = function (message) {
        window.showCafeAlert("Café Notice", String(message || ""), {
            type: "info",
            icon: "☕",
            showActions: true,
            showCancel: true,
            okText: "OK",
            cancelText: "CANCEL"
        });
    };

    
    window.showCafeConfirm = function (title, message, onOk, onCancel) {
        window.showCafeAlert(title, message, {
            type: "warning",
            icon: "☕",
            showActions: true,
            showCancel: true,
            okText: "OK",
            cancelText: "CANCEL",
            onOk: onOk,
            onCancel: onCancel
        });
    };
})();
