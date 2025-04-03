import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

async function loadHomeData() {
    try {
        const homeRef = ref(db, "Admin/admin_dashboard/home");
        const snapshot = await get(homeRef);

        if (snapshot.exists()) {
            const data = snapshot.val();

            // ✅ Update text content
            document.getElementById("homeName").textContent = data.name || "Unknown";
            document.getElementById("homeDegree").textContent = data.degree || "No degree specified";

            // ✅ Handle Resume Download Button
            const resumeButton = document.getElementById("homeResumeLink");
            if (data.resumeName) {
                resumeButton.href = convertDriveToDownloadLink(data.resumeName);
                resumeButton.style.display = "inline-block";  // Ensure button is visible
            } else {
                resumeButton.style.display = "none";  // Hide button if no resume
            }

            // ✅ Handle Profile Image
            const profileImage = document.getElementById("homeProfileImage");
            if (data.imageName) {
                profileImage.src = convertDriveToPublicImageLink(data.imageName);
            } else {
                profileImage.src = convertDriveToPublicImageLink("https://drive.google.com/file/d/1F4rrsOsto3iN_q0FL9IazmgeHMrWy2Af/view?usp=drive_link"); // Default image
            }
        } else {
            console.warn("⚠️ No Home Data Found.");
        }
    } catch (error) {
        console.error("❌ Error Loading Home Data:", error);
    }
}

// ✅ Convert Google Drive View Link to Direct Download Link
function convertDriveToDownloadLink(driveLink) {
    const match = driveLink.match(/\/d\/(.*?)(\/|$)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return driveLink; // Return original if not a Drive link
}

// ✅ Convert Google Drive View Link to Public Image Link
function convertDriveToPublicImageLink(driveLink) {
    const match = driveLink.match(/\/d\/(.*?)(\/|$)/);
    if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}=s1000`; // Public image URL
    }
    return driveLink; // Return original if not a Drive link
}

// ✅ Load data when the page loads
document.addEventListener("DOMContentLoaded", loadHomeData);
