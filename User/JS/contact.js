import { getDatabase, ref, get, push, set } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js"; // Ensure this path is correct

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactform");

    if (!contactForm) {
        console.error("❌ Contact form not found!");
        return;
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Retrieve input elements safely
        const nameInput = document.getElementById("fullName");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");

        // Ensure elements exist before accessing .value
        if (!nameInput || !emailInput || !messageInput) {
            console.error("❌ Form input fields are missing.");
            alert("⚠️ Form fields are missing in the DOM.");
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Validate input values
        if (!name || !email || !message) {
            alert("⚠️ Please fill in all fields before submitting.");
            return;
        }

        try {
            // Reference to Firebase database path (Admin/contactform)
            const contactFormRef = ref(db, "Admin/contactform");
            const newContactRef = push(contactFormRef);

            // Store data in Firebase
            await set(newContactRef, {
                name: name,    
                email: email,  
                message: message,  
                timestamp: new Date().toISOString(),
            });

            alert("✅ Message sent successfully!");
            contactForm.reset(); // Clear the form after submission
        } catch (error) {
            console.error("❗ Error submitting form:", error);
            alert("❌ Failed to send message. Please try again.");
        }
    });
});


async function loadContactLinks() {
    try {
        const contactRef = ref(db, "Admin/admin_dashboard/contact");
        const snapshot = await get(contactRef);

        if (snapshot.exists()) {
            const contactData = snapshot.val();
            if (contactData && typeof contactData === "object") {
                const socialMediaContainer = document.querySelector(".social-media");
                socialMediaContainer.innerHTML = "";

                if (contactData.linkedin) {
                    socialMediaContainer.innerHTML += `<a href="${contactData.linkedin}" class="btn btn-outline-primary btn-sm" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a> `;
                }

                if (contactData.github) {
                    socialMediaContainer.innerHTML += `<a href="${contactData.github}" class="btn btn-outline-dark btn-sm" target="_blank"><i class="fab fa-github"></i> GitHub</a> `;
                }

                if (contactData.twitter) {
                    socialMediaContainer.innerHTML += `<a href="${contactData.twitter}" class="btn btn-outline-info btn-sm" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>`;
                }
            }
        } else {
            console.warn("⚠️ No social media links found.");
        }
    } catch (error) {
        console.error("❗ Error loading contact links:", error);
    }
}

document.addEventListener("DOMContentLoaded", loadContactLinks);
