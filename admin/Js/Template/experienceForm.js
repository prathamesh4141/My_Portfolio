import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

// Experience Form Template
export const experienceFormTemplate = `
    <div class="container">
        <h2>Experience Section</h2>
        <form id="experienceForm">
            <div id="experienceSections">
                ${generateExperienceSection(1)} <!-- Initial section added by default -->
            </div>
            <button type="button" id="addExperienceBtn">+ Add Experience</button>
            <button type="submit">Submit</button>
        </form>
    </div>
`;

// Generate dynamic experience section
function generateExperienceSection(index) {
    return `
        <div class="experience-section" id="exp_section_${index}">
            <h3>Experience ${index}</h3>
            <div class="form-group">
                <label for="exp${index}_title">Title</label>
                <input type="text" id="exp${index}_title" name="exp${index}_title" placeholder="Enter position" required>
            </div>
            <div class="form-group">
                <label for="exp${index}_company">Company Name</label>
                <input type="text" id="exp${index}_company" name="exp${index}_company" placeholder="Company name" required>
            </div>
            <div class="form-group">
                <label for="exp${index}_duration">Duration</label>
                <input type="text" id="exp${index}_duration" name="exp${index}_duration" placeholder="e.g., Sept 2023 - Nov 2024" required>
            </div>
            <div class="form-group">
                <label for="exp${index}_description">Experience Description (One per line)</label>
                <textarea id="exp${index}_description" name="exp${index}_description" placeholder="Describe responsibilities..." required></textarea>
            </div>
            <button type="button" id="remove" class="removeEduBtn" data-index="${index}">Remove</button>
        </div>
    `;
}

// Load existing experience data
async function loadExperienceData() {
    try {
        const expRef = ref(db, "Admin/admin_dashboard/experience");
        const snapshot = await get(expRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const expContainer = document.getElementById("experienceSections");

            // Populate experience dynamically based on available data
            let index = 1;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const expData = data[key];
                    if (index > 1) {
                        expContainer.insertAdjacentHTML('beforeend', generateExperienceSection(index));
                    }
                    document.getElementById(`exp${index}_title`).value = expData.title || "";
                    document.getElementById(`exp${index}_company`).value = expData.company || "";
                    document.getElementById(`exp${index}_duration`).value = expData.duration || "";
                    document.getElementById(`exp${index}_description`).value = expData.description?.join("\n") || "";
                    index++;
                }
            }
        }
    } catch (error) {
        console.error("Error loading experience data:", error);
        alert("Error loading experience data. Please try again.");
    }
}

// Save experience data to Firebase
export function handleExperienceFormSubmission() {
    loadExperienceData(); // Load existing data when the form is opened

    let expCount = 1; // Start with 1 by default

    // Add experience dynamically
    document.getElementById("addExperienceBtn").addEventListener("click", function () {
        expCount++;
        const expContainer = document.getElementById("experienceSections");
        expContainer.insertAdjacentHTML('beforeend', generateExperienceSection(expCount));
    });

    // Event delegation to handle dynamically added remove buttons
    document.getElementById("experienceSections").addEventListener("click", function (event) {
        if (event.target.classList.contains("removeEduBtn")) {
            const sectionIndex = event.target.getAttribute("data-index");
            const sectionToRemove = document.getElementById(`exp_section_${sectionIndex}`);

            if (sectionToRemove) {
                sectionToRemove.remove(); // Remove the section
            }
        }
    });


    // Handle form submission
    // Handle form submission
    document.getElementById("experienceForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // ✅ Corrected session check
        if (!sessionStorage.getItem("adminUID")) {
            alert("⚠️ Unauthorized Access! Please login.");
            window.location.href = "Adminlogin.html";
            return;
        }

        // Collect dynamic form data
        const experienceData = {};
        for (let i = 1; i <= expCount; i++) {
            if (document.getElementById(`exp${i}_title`)) {
                experienceData[`exp${i}`] = {
                    title: document.getElementById(`exp${i}_title`).value,
                    company: document.getElementById(`exp${i}_company`).value,
                    duration: document.getElementById(`exp${i}_duration`).value,
                    description: document.getElementById(`exp${i}_description`).value.split("\n"),
                };
            }
        }

        try {
            // ✅ Store experience data in Admin/admin_dashboard/experience
            await set(ref(db, "Admin/admin_dashboard/experience"), experienceData);
            alert("✅ Experience data saved successfully!");
        } catch (error) {
            console.error("❌ Error saving experience data:", error);
            alert("⚠️ Error saving data. Please try again.");
        }
    });
}
