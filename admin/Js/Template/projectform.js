import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

export const projectFormTemplate = `
    <div class="container">
        <h2>Projects Section</h2>
        <form id="projectsForm">
            <div id="projectsContainer">
                <!-- Project fields will be dynamically added here -->
            </div>
            <button type="button" id="addProjectBtn">Add Project</button>
            <br><br>
            <button type="submit">Submit</button>
        </form>
    </div>
`;

let projectCount = 0;

// Function to generate project field template
function createProjectFields(index, data = {}) {
    return `
        <div class="project-group" id="projectGroup${index}">
            <h4>Project ${index + 1}</h4>
            <div class="form-group">
                <label for="title${index}">Project Title</label>
                <input type="text" id="title${index}" name="title${index}" placeholder="Enter project title" value="${data.title || ''}" required>
            </div>
            <div class="form-group">
                <label for="description${index}">Description</label>
                <textarea id="description${index}" name="description${index}" placeholder="Enter project description" required>${data.description || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="link${index}">GitHub/Live Link</label>
                <input type="text" id="link${index}" name="link${index}" placeholder="Enter project link" value="${data.link || ''}" required>
            </div>
            <div class="form-group">
                <label for="exp${index}_duration">Duration</label>
                <input type="text" id="exp${index}_duration" name="exp${index}_duration" placeholder="e.g., Sept 2023 - Nov 2024" value="${data.duration || ''}" required>
            </div>
            <button type="button" id="remove" class="removeProjectBtn" data-index="${index}">Remove</button>
        </div>
    `;
}


// Load existing data when the page loads
async function loadProjectData() {
    try {
        const adminRef = ref(db, "Admin/admin_dashboard/projects");
        const snapshot = await get(adminRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const projectsContainer = document.getElementById("projectsContainer");
            projectsContainer.innerHTML = ""; // Clear any existing data
            projectCount = 0;

            if (data.projects && data.projects.length > 0) {
                data.projects.forEach((proj, index) => {
                    projectsContainer.insertAdjacentHTML('beforeend', createProjectFields(index, proj));
                    projectCount++;
                });
            }
        }
    } catch (error) {
        console.error("Error loading project data:", error);
        alert("Error loading data. Please try again.");
    }
}


// Save form data to Firebase
export function handleProjectFormSubmission() {
    loadProjectData(); // Load existing data

    document.getElementById('projectsForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Check if the admin is logged in
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            alert("Unauthorized Access! Please login.");
            window.location.href = "Adminlogin.html";
            return;
        }

        const projectData = [];
        for (let i = 0; i < projectCount; i++) {
            if (document.getElementById(`title${i}`)) {
                projectData.push({
                    title: document.getElementById(`title${i}`).value,
                    description: document.getElementById(`description${i}`).value,
                    link: document.getElementById(`link${i}`).value,
                    duration: document.getElementById(`exp${i}_duration`).value,
                });
            }
        }

        try {
            await set(ref(db, "Admin/admin_dashboard/projects"), { projects: projectData });
            alert("Projects saved successfully!");
        } catch (error) {
            console.error("Error saving project data:", error);
            alert("Error saving data. Please try again.");
        }
    });

    // Add event listener to dynamically add project fields
    document.getElementById('addProjectBtn').addEventListener('click', () => {
        const projectsContainer = document.getElementById("projectsContainer");
        projectsContainer.insertAdjacentHTML('beforeend', createProjectFields(projectCount));
        projectCount++;
    });

    // Remove project fields dynamically
    document.getElementById('projectsContainer').addEventListener('click', function (event) {
        if (event.target.classList.contains('removeProjectBtn')) {
            const index = event.target.getAttribute('data-index');
            document.getElementById(`projectGroup${index}`).remove();
        }
    });
}
