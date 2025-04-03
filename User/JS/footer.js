import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { db } from "/DB/databaseConfig.js";

async function loadfooterData() {

    try {
        const homeRef = ref(db, "Admin/admin_dashboard/home");
        const snapshot = await get(homeRef);

        if (snapshot.exists()) {
            const data = snapshot.val();

            let footername = `\u00A9 2025 ${data.name}. All Rights Reserved.`

            // Update HTML elements with fetched data
            document.getElementById("footername").textContent = footername || "Unknown";
        } else {
            console.warn("⚠️ No Home Data Found.");
        }
    } catch (error) {
        console.error("❌ Error Loading Home Data:", error);
    }
}

// Load data when the page loads
document.addEventListener("DOMContentLoaded", loadfooterData);
