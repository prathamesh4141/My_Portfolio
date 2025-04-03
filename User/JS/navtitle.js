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