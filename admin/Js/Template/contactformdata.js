import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

// Export the contact form data template
export const contactFormdataTemplate = `
    <h2>Contact Form Submissions</h2>
    <table id="contact-data-table" class="table table-bordered">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Timestamp</th>
            </tr>
        </thead>
        <tbody>
            <!-- Data will be dynamically inserted here -->
        </tbody>
    </table>
`;

// Export the loadContactFormData function
export async function loadContactFormData() {

    // Reference to container where the table will be inserted
    const container = document.getElementById("content");

    // Check if container exists
    if (!container) {
        console.error("❌ Contact form data container not found.");
        return;
    }

    // Insert the contact form table template into the container
    container.innerHTML = contactFormdataTemplate;  // Fixed: Changed to correct template variable

    try {
        // Reference to 'contactform' data in Firebase
        const contactFormRef = ref(db, "Admin/contactform");
        const snapshot = await get(contactFormRef);

        // If the data exists in Firebase
        if (snapshot.exists()) {
            const data = snapshot.val();

            // Get the table body element
            const tableBody = document.getElementById("contact-data-table").getElementsByTagName('tbody')[0];

            // Loop through the data and populate the table
            Object.keys(data).forEach(key => {
                const contact = data[key];

                // Ensure that the contact object has the required properties
                if (contact && contact.name && contact.email && contact.message && contact.timestamp) {
                    const row = tableBody.insertRow();

                    // Insert cells for each column
                    const nameCell = row.insertCell(0);
                    nameCell.textContent = contact.name;

                    const emailCell = row.insertCell(1);
                    emailCell.textContent = contact.email;

                    const messageCell = row.insertCell(2);
                    messageCell.textContent = contact.message;

                    const timestampCell = row.insertCell(3);
                    timestampCell.textContent = contact.timestamp;
                } else {
                    console.error("❌ Missing required contact data fields.");
                }
            });
        } else {
            console.log("❌ No data available.");
        }
    } catch (error) {
        console.error("❗ Error fetching data:", error);
    }
}

// You should also export this if you're using it in other places:
// export { loadContactFormData };
