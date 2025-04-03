import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

export const contactFormTemplate = `
    <div class="container">
        <h2>Contact Section</h2>
        <form id="contactForm">
            <div class="form-group">
                <label for="linkedin">LinkedIn URL</label>
                <input type="text" id="linkedin" name="linkedin" placeholder="Enter LinkedIn profile link" required>
            </div>
            <div class="form-group">
                <label for="github">GitHub URL</label>
                <input type="text" id="github" name="github" placeholder="Enter GitHub profile link" required>
            </div>
            <div class="form-group">
                <label for="twitter">Twitter URL</label>
                <input type="text" id="twitter" name="twitter" placeholder="Enter Twitter profile link" required>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
`;

// Load existing contact data
async function loadContactData() {
    try {
        const contactRef = ref(db, "Admin/admin_dashboard/contact");
        const snapshot = await get(contactRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            document.getElementById("linkedin").value = data.linkedin || "";
            document.getElementById("github").value = data.github || "";
            document.getElementById("twitter").value = data.twitter || "";
        }
    } catch (error) {
        console.error("Error loading contact data:", error);
        alert("Error loading data. Please try again.");
    }
}

// Save contact data to Firebase
export function handleContactFormSubmission() {
    loadContactData();

    document.getElementById('contactForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        // Check if the admin is logged in
        if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
            alert("Unauthorized Access! Please login.");
            window.location.href = "Adminlogin.html";
            return;
        }

        const contactData = {
            linkedin: document.getElementById("linkedin").value,
            github: document.getElementById("github").value,
            twitter: document.getElementById("twitter").value,
        };

        try {
            await set(ref(db, "Admin/admin_dashboard/contact"), contactData);
            alert("Contact details saved successfully!");
        } catch (error) {
            console.error("Error saving contact data:", error);
            alert("Error saving data. Please try again.");
        }
    });
}
