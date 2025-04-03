// ✅ Import Firebase modules
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { ref, set, get } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import { auth, db } from "/DB/databaseConfig.js"; // ✅ Correct path


// ✅ Handle Network Errors
function handleError(error) {
    if (error.code === "auth/network-request-failed") {
        alert("⚠️ Network error! Please check your internet connection and try again.");
    } else {
        alert("❌ Error: " + error.message);
    }
}

// ✅ Enable Persistent Login
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("✅ Persistence enabled!");
    })
    .catch((error) => console.error("❌ Error setting persistence:", error));


// ✅ Admin Login
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        // ✅ Authenticate Admin
        const adminCredential = await signInWithEmailAndPassword(auth, email, password);
        const adminId = adminCredential.user.uid;

        // ✅ Check if the user exists in the Admin path
        const adminRef = ref(db, "Admin/" + adminId);
        const adminSnapshot = await get(adminRef);

        if (adminSnapshot.exists()) {
            // ✅ Admin exists, proceed to dashboard
            sessionStorage.setItem("adminUID", adminId);
            sessionStorage.setItem("adminLoggedIn", "true");  // Set the sessionStorage item
            window.location.href = "/Admin/Admindashboard.html"; // Redirect to admin dashboard
        } else {
            alert("⚠️ No admin data found. Please contact support.");
            auth.signOut(); // Logout if admin data not found
        }
    } catch (error) {
        handleError(error);
    }
});