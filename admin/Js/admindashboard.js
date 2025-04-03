// ✅ Redirect to login if not logged in
if (!sessionStorage.getItem("adminUID")) {
    alert("⚠️ Unauthorized Access! Redirecting to Login Page.");
    window.location.href = "Adminlogin.html";
}

// ✅ Import templates and handle submission functions
import { aboutFormTemplate, handleAboutFormSubmission } from "./Template/aboutform.js";
import { experienceFormTemplate, handleExperienceFormSubmission } from "./Template/experienceForm.js";
import { homeFormTemplate, handleHomeFormSubmission } from "./Template/homeform.js"; 
import { skillFormTemplate, handleSkillFormSubmission } from "./Template/skillform.js";
import { projectFormTemplate, handleProjectFormSubmission } from "./Template/projectform.js";
import { contactFormTemplate, handleContactFormSubmission } from "./Template/contactform.js";
import { contactFormdataTemplate, loadContactFormData } from "./Template/contactformdata.js"; // Ensure this import is correct


// ✅ Import required Firebase modules
import { getDatabase, ref,  get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

try {
    // Load name from Firebase
    const homeRef = ref(db, "Admin/admin_dashboard/home");
    const snapshot = await get(homeRef);

    if (snapshot.exists()) {
        const data = snapshot.val();
        document.getElementById("navname").textContent = data.name || "Jon";
    }
} catch (error) {
    console.error("⚠️ Error loading home data:", error);
    alert("❌ Error loading data. Please try again.");
}


// ✅ Function to load a template dynamically
function loadTemplate(template, callback) {
    const contentDiv = document.getElementById("content");

    if (contentDiv) {
        contentDiv.innerHTML = template;  // Inject the template into the DOM
        // ✅ Ensure the callback (event listener addition) happens after the content is loaded
        if (callback) {
            // Delay the callback execution to ensure the form is fully loaded
            setTimeout(callback, 0);
        }
    } else {
        console.error("❌ Element with ID 'content' not found.");
    }
}


// ✅ Handle button clicks to load forms dynamically
document.querySelectorAll(".btn-dashboard").forEach((button) => {
    button.addEventListener("click", function () {
        const page = this.getAttribute("data-page");

        switch (page) {
            case "home":
                loadTemplate(homeFormTemplate, handleHomeFormSubmission);
                break;
            case "about":
                loadTemplate(aboutFormTemplate, handleAboutFormSubmission);
                break;
            case "experience":
                loadTemplate(experienceFormTemplate, handleExperienceFormSubmission);
                break;
            case "skills":
                loadTemplate(skillFormTemplate, handleSkillFormSubmission);
                break;
            case "project":
                loadTemplate(projectFormTemplate, handleProjectFormSubmission);
                break;
            case "contact":
                loadTemplate(contactFormTemplate, handleContactFormSubmission);
                break;
            case "maildata":
                loadTemplate(contactFormdataTemplate, loadContactFormData);
                break;
            default:
                document.getElementById("content").innerHTML = "<p>⚠️ Page not found!</p>";
                break;
        }
    });
});

// ✅ Logout button event
document.getElementById("logoutBtn")?.addEventListener("click", function () {
    sessionStorage.removeItem("adminUID"); // ✅ Clear session after logout
    window.location.href = "/Adminlogin.html";
});
