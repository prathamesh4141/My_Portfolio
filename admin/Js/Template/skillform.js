import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

export const skillFormTemplate = `
    <div class="container">
        <h2>Skills Section</h2>
        <form id="skillsForm">
            <div id="skillsContainer">
                <!-- Skill fields will be dynamically added here -->
            </div>
            <button type="button" id="addSkillBtn">Add Skill</button>
            <br><br>
            <button type="submit">Submit</button>
        </form>
    </div>
`;

let skillCount = 0;

// Function to generate skill field template
function createSkillFields(index, data = {}) {
    return `
        <div class="skill-group" id="skillGroup${index}">
            <h4>Skill ${index + 1}</h4>
            <div class="form-group">
                <label for="skill${index}">Skill Name</label>
                <input type="text" id="skill${index}" name="skill${index}" placeholder="e.g., JavaScript" value="${data.name || ''}" required>
            </div>
            <div class="form-group">
                <label for="level${index}">Proficiency (1-5, e.g., 4.5)</label>
                <input type="number" id="level${index}" name="level${index}" min="1" max="5" step="0.1" placeholder="e.g., 4.5" value="${data.level || ''}" required>
            </div>
            <button type="button" id="remove" class="removeSkillBtn" data-index="${index}">Remove</button>
        </div>
    `;
}


// Load existing data when the page loads
async function loadSkillData() {
    try {
        const skillRef = ref(db, "Admin/admin_dashboard/skills");
        const snapshot = await get(skillRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const skillsContainer = document.getElementById("skillsContainer");
            skillsContainer.innerHTML = "";
            skillCount = 0;

            if (data.skills && data.skills.length > 0) {
                data.skills.forEach((skill, index) => {
                    skillsContainer.insertAdjacentHTML('beforeend', createSkillFields(index, skill));
                    skillCount++;
                });
            }
        }
    } catch (error) {
        console.error("Error loading skill data:", error);
        alert("Error loading data. Please try again.");
    }
}

// Save form data to Firebase
export function handleSkillFormSubmission() {
    loadSkillData(); // Load existing data

    document.getElementById('skillsForm').addEventListener('submit', async function (event) {
        event.preventDefault();
    
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            alert("Unauthorized Access! Please login.");
            window.location.href = "Adminlogin.html";
            return;
        }
    
        const skillsData = [];
        for (let i = 0; i < skillCount; i++) {
            if (document.getElementById(`skill${i}`)) {
                skillsData.push({
                    name: document.getElementById(`skill${i}`).value,
                    level: parseFloat(document.getElementById(`level${i}`).value), // Ensure float value
                });
            }
        }
    
        try {
            await set(ref(db, "Admin/admin_dashboard/skills"), { skills: skillsData });
            alert("Skill data saved successfully!");
        } catch (error) {
            console.error("Error saving skill data:", error);
            alert("Error saving data. Please try again.");
        }
    });
    

    // Add event listener to dynamically add skill fields
    document.getElementById('addSkillBtn').addEventListener('click', () => {
        const skillsContainer = document.getElementById("skillsContainer");
        skillsContainer.insertAdjacentHTML('beforeend', createSkillFields(skillCount));
        skillCount++;
    });

    // Remove skill fields dynamically
    document.getElementById('skillsContainer').addEventListener('click', function (event) {
        if (event.target.classList.contains('removeSkillBtn')) {
            const index = event.target.getAttribute('data-index');
            document.getElementById(`skillGroup${index}`).remove();
        }
    });
}
