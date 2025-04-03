import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";  // Ensure this path is correct


// Load Skills Data
async function loadSkillsData() {
    try {
        // Reference to skills data in Firebase
        const skillsRef = ref(db, "Admin/admin_dashboard/skills/skills");
        const snapshot = await get(skillsRef);

        if (snapshot.exists()) {
            const data = snapshot.val();

            // Get container to append skills
            const skillsContainer = document.getElementById("skillsRow");
            skillsContainer.innerHTML = ""; // Clear previous content

            if (data && typeof data === "object") {
                Object.keys(data).forEach((key) => {
                    const skill = data[key];

                    // Get the rating and set it to be displayed as a number
                    const rating = parseInt(skill.rating) || 0;  // Ensure rating is a number, default to 0 if invalid

                    // Create skill card HTML with the rating as a number
                    const skillCard = `
                        <div class="col-md-3 col-sm-6 mb-4" id="skill-${skill.name}">
                            <div class="card skill-card">
                                <div class="card-body text-center">
                                    <h5 class="skill-name">${skill.name}</h5>
                                    <div class="rating">Rating: ${skill.level} / 5</div>
                                </div>
                            </div>
                        </div>
                    `;

                    // Insert skill card into the container
                    skillsContainer.insertAdjacentHTML("beforeend", skillCard);
                });
            } else {
                console.warn("⚠️ No skills data found.");
                skillsContainer.innerHTML = `<p class="text-light">No Skills Found.</p>`;
            }
        } else {
            console.error("❌ No data found for 'skills'.");
            skillsContainer.innerHTML = `<p class="text-light">No Skills Information Available.</p>`;
        }
    } catch (error) {
        console.error("❗ Error loading skills data:", error);
        document.getElementById("skillsRow").innerHTML = `<p class="text-light">Error loading skills information.</p>`;
    }
}

// Load data when page loads
document.addEventListener("DOMContentLoaded", loadSkillsData);