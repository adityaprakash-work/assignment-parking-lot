import { GetInput } from "../../backend/js/utils.js";

const eUsername = document.getElementById("username");
const eEmail = document.getElementById("email");
const ePassword = document.getElementById("password");
const eButton = document.getElementById("submit");

const API_BASE_URL = process.env.API_BASE_URL;

eButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const username = GetInput(eUsername);
    const email = GetInput(eEmail);
    const password = GetInput(ePassword);

    if (!username || !email || !password) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password }),
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("userId", result.message.userId);
            window.location.href = result.redirectTo;
            alert(result.message.text);
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Failed to connect to the backend:", error);
    }
});