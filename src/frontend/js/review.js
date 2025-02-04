import { GetInput } from "../../backend/js/utils.js";

const eReview = document.getElementById("reviewText");
const eButton = document.getElementById("submit");

const API_BASE_URL = process.env.API_BASE_URL;

eButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const review = eReview.value.trim();
    console.log("function called")

    if (!review) {
        alert("Review cannot be empty.");
        return;
    }

    const userId = "123";

    try {
        const response = await fetch(`${API_BASE_URL}/review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, review }),
        });

        const result = await response.json();

        if (result.success) {
            alert(result.message);
            window.location.href = result.redirectTo;
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Failed to connect to the backend:", error);
        alert("Failed to submit review. Check console for errors.");
    }
});


// async function FetchReviewData(){
//     try {
//         const response = await fetch("http://localhost:8080/api/reviewdata");
//         const result = await response.json();
    
//         if (result.success) {
//             //populateParkingList(result.message);
//         } else {
//             alert("No Parking Slots Avaiable!");
//         }
//     } catch (error) {
//         alert(`Error Occurred ${error}`);
//     }
// }