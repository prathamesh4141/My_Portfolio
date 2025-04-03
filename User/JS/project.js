import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js"; // Ensure this path is correct

// Fetch data for projects and contact links
async function loadProjectAndContactLinks() {
    try {
        // Reference to projects data in Firebase
        const projectsRef = ref(db, "Admin/admin_dashboard/projects/projects");
        const linkRef = ref(db, "Admin/admin_dashboard/contact");

        const snapshot = await get(projectsRef);
        const linkSnapshot = await get(linkRef);

        // Check if 'projects' data exists
        if (snapshot.exists()) {
            const projectsData = snapshot.val();
            if (projectsData && typeof projectsData === "object") {
                Object.keys(projectsData).forEach((key) => {
                    const project = projectsData[key];

                    // Create project card HTML dynamically
                    const projectCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card cardsize bg-secondary shadow p-3 rounded">
                                <div class="card-body">
                                    <h5 class="card-title">${project.title}</h5>
                                    <h5 class="card-text">${project.
                                        duration
                                        }</h5>
                                    <p class="card-text">${project.description}</p>
                                    <a href="${project.link}" target="_blank" class="btn btn-primary">View Project</a>
                                </div>
                            </div>
                        </div>
                    `;
                    // Insert project card into the container
                    document.getElementById("projectsRow").insertAdjacentHTML("beforeend", projectCard);
                });
            }
        } else {
            console.error("❌ No data found for 'projects'.");
        }

        // Check if 'contact' data exists
        if (linkSnapshot.exists()) {
            const linkData = linkSnapshot.val();
            const gitLink = linkData.github;  // Access the github link directly

            if (gitLink) {
                // Create the "More Projects" button with the GitHub link
                const moreProjectsButton = `<a class="btn btn-primary" id="repolink" href="${gitLink}" target="_blank">More Projects</a>`;
                document.getElementById("moreproject").insertAdjacentHTML("beforeend", moreProjectsButton);
            } else {
                console.error("❌ GitHub link not found in the contact data.");
            }
        } else {
            console.error("❌ No data found for 'contact' links.");
        }
    } catch (error) {
        console.error("❗ Error loading data:", error);
    }
}

// Load data when the page loads
document.addEventListener("DOMContentLoaded",loadProjectAndContactLinks);
