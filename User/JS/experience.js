import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";


// Load Experience Data
async function loadExperienceData() {
    try {
        // Reference to experience data in Firebase
        const experienceRef = ref(db, "Admin/admin_dashboard/experience");
        const snapshot = await get(experienceRef);

        if (snapshot.exists()) {
            const data = snapshot.val();

            // Clear previous experience entries
            const timelineButtons = document.getElementById("timelineButtons");
            const timelineCenter = document.getElementById("timelineCenter");

            timelineButtons.innerHTML = "";
            timelineCenter.innerHTML = "";

            // Check if data is an object
            if (data && typeof data === "object") {
                Object.keys(data).forEach((key, index) => {
                    const exp = data[key];
                    const year = exp.duration.replace(/\s+/g, "-");

                    // Create a button for each timeline year
                    const button = `
            <button class="btn btn-outline-primary timeline-year" 
                data-year="${year}" 
                onclick="showExperience('${year}')">
                ${exp.duration}
            </button>
        `;
                    timelineButtons.insertAdjacentHTML("beforeend", button);

                    // Create experience details dynamically
                    const expItem = `
            <div class="timeline-item card text-center p-3 shadow ${index === 0 ? 'active' : ''}" 
                id="year-${year}">
                <h5 class="card-title">${exp.title || "N/A"}</h5>
                <p class="card-subtitle mb-2"><strong>${exp.company || "N/A"}</strong></p>
                <ul>
                    ${exp.description.map(detail => `<li>${detail}</li>`).join("")}
                </ul>
            </div>
        `;
                    timelineCenter.insertAdjacentHTML("beforeend", expItem);
                });

                // Show the first experience by default
                const firstYear = Object.values(data)[0].duration.replace(/\s+/g, "-");
                showExperience(firstYear);
            } else {
                console.warn("⚠️ No experience data found.");
                timelineCenter.innerHTML = `<p class="text-light">No Experience Details Found.</p>`;
            }

        } else {
            console.error("❌ No data found for 'experience'.");
            timelineCenter.innerHTML = `<p class="text-light">No Experience Information Available.</p>`;
        }
    } catch (error) {
        console.error("❗ Error loading experience data:", error);
        timelineCenter.innerHTML = `<p class="text-light">Error loading experience information.</p>`;
    }
}

// Show experience based on year
window.showExperience = function (year) {

    // Hide all experience items
    document.querySelectorAll(".timeline-item").forEach(item => {
        item.style.display = "none";
    });

    // Remove active class from all buttons
    document.querySelectorAll(".timeline-year").forEach(btn => {
        btn.classList.remove("active");
    });

    // Find and show the correct experience item
    const activeItem = document.getElementById(`year-${year}`);
    if (activeItem) {

        // Ensure it's visible
        activeItem.style.display = "block";
        activeItem.style.opacity = "1"; // In case opacity is affecting visibility
    } else {
        console.error(`❌ Experience item not found: year-${year}`);
    }

    // Find and highlight the active button
    const activeButton = document.querySelector(`[data-year="${year}"]`);
    if (activeButton) {
        console.log(`✅ Found button: [data-year="${year}"]`);
        activeButton.classList.add("active");
    } else {
        console.error(`❌ Button not found for year: ${year}`);
    }
};


// Load data when page loads
document.addEventListener("DOMContentLoaded", loadExperienceData);

