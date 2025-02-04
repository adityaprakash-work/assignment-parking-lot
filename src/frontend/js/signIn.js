import { GetInput } from "../../backend/js/utils.js";

const eEmail = document.getElementById("email");
const ePassword = document.getElementById("password");
const eButton = document.getElementById("submit");

const API_BASE_URL = process.env.API_BASE_URL;

eButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = GetInput(eEmail);
    const password = GetInput(ePassword);

    try {
        const response = await fetch(`${API_BASE_URL}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("userId", result.message.userId);
            window.location.href = result.redirectTo;
            alert(result.message.text);
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Failed to connect to the backend:", error);
    }

});
