// Import Firebase functions via CDN (Using v12.13.0)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPXozTnQ3Xt7eWVEsCjEpZcaV1ym_uZ30",
    authDomain: "jdbgames-8cdb2.firebaseapp.com",
    projectId: "jdbgames-8cdb2",
    storageBucket: "jdbgames-8cdb2.firebasestorage.app",
    messagingSenderId: "316275948182",
    appId: "1:316275948182:web:f10ec25023bae6ab6ea0b7",
    measurementId: "G-7P3DXD8KEB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Tracks page views automatically
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Grab UI Elements from your index.html
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userProfile = document.getElementById('user-profile');
const userName = document.getElementById('user-name');
const userPfp = document.getElementById('user-pfp');

// 1. Handle Login Click
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        try {
            console.log("Attempting to connect to Google Auth...");
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error logging in:", error);
            alert("Failed to login. Please make sure popups are allowed and your Vercel domain is added to Firebase Authorized Domains.");
        }
    });
}

// 2. Handle Logout Click
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            console.log("Logged out successfully.");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    });
}

// 3. Check Connection & Listen for Login State Changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // --- CONNECTED & LOGGED IN ---
        console.log("🟢 Firebase Connected! Logged in as:", user.displayName);
        
        // Hide login button, show profile info
        if (loginBtn) loginBtn.style.display = 'none';
        if (userProfile) userProfile.style.display = 'flex';
        if (userName) userName.innerText = user.displayName;
        if (userPfp) userPfp.src = user.photoURL;
        
        // Save UID globally so games can access their cloud save
        localStorage.setItem('jdbd_uid', user.uid); 
    } else {
        // --- CONNECTED BUT LOGGED OUT ---
        console.log("🟡 Firebase Connected! No user currently logged in.");
        
        // Show login button, hide profile info
        if (loginBtn) loginBtn.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
        
        // Clear UID
        localStorage.removeItem('jdbd_uid');
    }
});