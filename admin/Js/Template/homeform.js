// ✅ Import required Firebase modules
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

// ✅ Home Form Template
export const homeFormTemplate = `
    <section id="homeForm" class="py-5">
        <div class="container">
            <h2 class="fw-bold mb-4 text-center">Home Section</h2>
            
            <!-- Form Section -->
            <form id="homeForm">
                <!-- Name Input -->
                <div class="form-group">
                    <label for="homeName" class="form-label text-light">Name</label>
                    <input type="text" class="form-control" id="homeName" placeholder="Enter your name" required>
                </div>

                <!-- Degree Input -->
                <div class="form-group">
                    <label for="homeDegree" class="form-label text-light">Degree / Title</label>
                    <input type="text" class="form-control" id="homeDegree" placeholder="Enter your degree" required>
                </div>

                <!-- Resume Name Input -->
                <div class="form-group">
                    <label for="homeResume" class="form-label text-light">Resume File Name</label>
                    <input type="text" class="form-control" id="homeResume" placeholder="Enter resume file name (e.g., resume.pdf)">
                </div>

                <!-- Image Name Input -->
                <div class="form-group">
                    <label for="homeImage" class="form-label text-light">Profile Image File Name</label>
                    <input type="text" class="form-control" id="homeImage" placeholder="Enter image file name (e.g., profile.jpg)">
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    </section>
`;

// ✅ Load data from Firebase and populate form fields
const loadHomeFormData = async () => {
    try {
        // Load name, degree, resume, and image from Firebase
        const homeRef = ref(db, "Admin/admin_dashboard/home");
        const snapshot = await get(homeRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById("homeName").value = data.name || "";
            document.getElementById("homeDegree").value = data.degree || "";
            document.getElementById("homeResume").value = data.resumeName || "";
            document.getElementById("homeImage").value = data.imageName || "";

        }
    } catch (error) {
        console.error("⚠️ Error loading home data:", error);
        alert("❌ Error loading data. Please try again.");
    }
};

// ✅ Save form data to Firebase
const saveHomeFormData = async (name, degree, resumeName, imageName) => {
    try {
        // ✅ Store only file names in Firebase
        const formData = {
            name,
            degree,
            resumeName,
            imageName
        };
        await set(ref(db, "Admin/admin_dashboard/home"), formData);

        alert("✅ Home data updated successfully!");
    } catch (error) {
        console.error("❌ Error saving home data:", error);
        alert("⚠️ Error saving data. Please try again.");
    }
};

// ✅ Handle form submission
export const handleHomeFormSubmission = () => {
    loadHomeFormData(); // Load existing data from Firebase

    setTimeout(() => {
        const form = document.getElementById("homeForm");
        if (form) {
            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                // Get form data
                const name = document.getElementById("homeName").value.trim();
                const degree = document.getElementById("homeDegree").value.trim();
                const resumeName = document.getElementById("homeResume").value.trim();
                const imageName = document.getElementById("homeImage").value.trim();

                if (!name) {
                    alert("⚠️ Name cannot be empty. Please enter your name.");
                    return;
                }
                await saveHomeFormData(name, degree, resumeName, imageName);
            });
        } else {
            console.error("❌ Form not found after template load.");
        }
    }, 0);
};
