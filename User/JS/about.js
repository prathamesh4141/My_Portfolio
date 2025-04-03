import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

// Load About and Education Data
async function loadAboutData() {
    try {
        // Reference to about data in Firebase
        const aboutRef = ref(db, "Admin/admin_dashboard/about");
        const snapshot = await get(aboutRef);

        if (snapshot.exists()) {
            const data = snapshot.val();

            // Set About Me data
            document.getElementById("name").innerText = data.name || "N/A";
            document.getElementById("degree").innerText = data.degree || "N/A";
            document.getElementById("bio").innerText = data.bio || "N/A";

            // Clear previous education entries
            document.getElementById("educationTimeline").innerHTML = "";

            // Check if education data is available
            if (data.education && Array.isArray(data.education)) {
                data.education.forEach((edu) => {
                    // Create an education item dynamically
                    const eduItem = `
                        <div class="education-item mb-3">
                            <span class="circle"></span>
                            <h5 class="fw-bold">${edu.degree || "N/A"}</h5>
                            <p>${edu.university || "N/A"}</p>
                            <p>${edu.date || "N/A"}</p>
                            <p><strong>Percentage:</strong> ${edu.cgpa || "N/A"}</p>
                        </div>
                    `;
                    educationTimeline.insertAdjacentHTML("beforeend", eduItem);
                });
            } else {
                console.warn("⚠️ No education details found.");
                educationTimeline.innerHTML = `<p class="text-light">No Education Details Found.</p>`;
            }
        } else {
            console.error("❌ No data found for 'about'.");
            bioElement.innerText = "No About Information Available.";
        }
    } catch (error) {
        console.error("❗ Error loading about data:", error);
        bioElement.innerText = "Error loading about information.";
    }
}

// Load data when page loads
document.addEventListener("DOMContentLoaded", loadAboutData);
