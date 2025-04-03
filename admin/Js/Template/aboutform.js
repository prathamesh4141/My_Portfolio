import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

export const aboutFormTemplate = `
    <div class="container">
        <h2>About Me Section</h2>
        <form id="aboutMeForm">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
                <label for="degree">Degree / Program</label>
                <input type="text" id="degree" name="degree" placeholder="e.g., Master of Science in Web Engineering" required>
            </div>
            <div class="form-group">
                <label for="bio">Bio / Introduction</label>
                <textarea id="bio" name="bio" placeholder="Write about yourself..." required></textarea>
            </div>

            <h3>Education Details</h3>
            <div id="educationContainer">
                <!-- Education fields will be dynamically added here -->
            </div>

            <button type="button" id="addEducationBtn">Add Education</button>
            <br><br>
            <button type="submit">Submit</button>
        </form>
    </div>
`;

let educationCount = 0;

// Function to generate education field template
function createEducationFields(index, data = {}) {
    return `
        <div class="education-group" id="eduGroup${index}">
            <h4>Education ${index + 1}</h4>
            <div class="form-group">
                <label for="edu${index}">Degree</label>
                <input type="text" id="edu${index}" name="edu${index}" placeholder="e.g., Master of Science in Web Engineering" value="${data.degree || ''}" required>
            </div>
            <div class="form-group">
                <label for="university${index}">University Name</label>
                <input type="text" id="university${index}" name="university${index}" placeholder="Enter university name" value="${data.university || ''}" required>
            </div>
            <div class="form-group">
                <label for="date${index}">Start - End Date</label>
                <input type="text" id="date${index}" name="date${index}" placeholder="e.g., October 2024 - Present" value="${data.date || ''}" required>
            </div>
            <div class="form-group">
                <label for="cgpa${index}">Percentage/CGPA</label>
                <input type="text" id="cgpa${index}" name="cgpa${index}" placeholder="e.g., 8.5 or 85%" value="${data.cgpa || ''}" required>
            </div>
            <button type="button" id="remove" class="removeEduBtn" data-index="${index}">Remove</button>
        </div>
    `;
}

// Load existing data when the page loads
async function loadFormData() {
    try {
        const adminRef = ref(db, "Admin/admin_dashboard/about");
        const snapshot = await get(adminRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById('name').value = data.name || '';
            document.getElementById('degree').value = data.degree || '';
            document.getElementById('bio').value = data.bio || '';

            const educationContainer = document.getElementById("educationContainer");
            educationContainer.innerHTML = ""; // Clear any existing data
            educationCount = 0;

            if (data.education && data.education.length > 0) {
                data.education.forEach((edu, index) => {
                    educationContainer.insertAdjacentHTML('beforeend', createEducationFields(index, edu));
                    educationCount++;
                });
            }
        }
    } catch (error) {
        console.error("Error loading form data:", error);
        alert("Error loading data. Please try again.");
    }
}

// Save form data to Firebase
export function handleAboutFormSubmission() {
    loadFormData(); // Load existing data

    document.getElementById('aboutMeForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Check if the admin is logged in
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            alert("Unauthorized Access! Please login.");
            window.location.href = "Adminlogin.html"; // Redirect to login if not logged in
            return;
        }

        const educationData = [];
        for (let i = 0; i < educationCount; i++) {
            if (document.getElementById(`edu${i}`)) {
                educationData.push({
                    degree: document.getElementById(`edu${i}`).value,
                    university: document.getElementById(`university${i}`).value,
                    date: document.getElementById(`date${i}`).value,
                    cgpa: document.getElementById(`cgpa${i}`).value,
                });
            }
        }

        const formData = {
            name: document.getElementById('name').value,
            degree: document.getElementById('degree').value,
            bio: document.getElementById('bio').value,
            education: educationData,
        };

        try {
            // Store data in Admin/admin_dashboard
            await set(ref(db, "Admin/admin_dashboard/about"), formData);
            alert("Form data saved successfully!");
        } catch (error) {
            console.error("Error saving form data:", error);
            alert("Error saving data. Please try again.");
        }
    });

    // Add event listener to dynamically add education fields
    document.getElementById('addEducationBtn').addEventListener('click', () => {
        const educationContainer = document.getElementById("educationContainer");
        educationContainer.insertAdjacentHTML('beforeend', createEducationFields(educationCount));
        educationCount++;
    });

    // Remove education fields dynamically
    document.getElementById('educationContainer').addEventListener('click', function (event) {
        if (event.target.classList.contains('removeEduBtn')) {
            const index = event.target.getAttribute('data-index');
            document.getElementById(`eduGroup${index}`).remove();
        }
    });
}
