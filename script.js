import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, push, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBq7fpaxJmlexazmlrLTQWguxamJdHYZ5o",
  authDomain: "newoaa-631e7.firebaseapp.com",
  databaseURL: "https://newoaa-631e7-default-rtdb.firebaseio.com",
  projectId: "newoaa-631e7",
  storageBucket: "newoaa-631e7.firebasestorage.app",
  messagingSenderId: "686667032319",
  appId: "1:686667032319:web:bdbb56897b046f3aab8eca",
  measurementId: "G-J0HPYLS4TR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("rsvpOverlay");
  const form = document.getElementById("rsvpForm");
  const thankyou = document.getElementById("thankyouPopup");
  const sorry = document.getElementById("sorryPopup");

  // If already done, never show again
  if (localStorage.getItem("rsvpDone")) {
    return;
  }

  // Show form on scroll once
  const showFormOnScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
      overlay.style.display = "flex";
      window.removeEventListener("scroll", showFormOnScroll); // stop listener after show once
    }
  };
  window.addEventListener("scroll", showFormOnScroll);

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = form.name.value.trim();
      const coming = form.coming.value;
      const count = form.count.value;

      if (!name) {
        alert("कृपया नाम भरें");
        return;
      }

      // Immediately hide form (fast response)
      overlay.style.display = "none";

      // Show instant feedback popup
      if (coming === "Yes") {
        thankyou.style.display = "flex";
        setTimeout(() => { thankyou.style.display = "none"; }, 4000);
      } else if (coming === "No") {
        sorry.style.display = "flex";
        setTimeout(() => { sorry.style.display = "none"; }, 5000);
      }

      try {
        // Check duplicate
        const responsesRef = ref(db, "rsvpResponses");
        let duplicate = false;

        await new Promise((resolve) => {
          onValue(responsesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              Object.values(data).forEach((res) => {
                if (res.name && res.name.toLowerCase() === name.toLowerCase()) {
                  duplicate = true;
                }
              });
            }
            resolve();
          }, { onlyOnce: true });
        });

        if (duplicate) {
          alert("❌ यह नाम पहले से RSVP कर चुका है।");
          return;
        }

        // Save to Firebase
        const newRef = push(responsesRef);
        await set(newRef, {
          coming,
          name,
          count,
          timestamp: new Date().toISOString()
        });

        // Mark user done
        localStorage.setItem("rsvpDone", "true");

      } catch (err) {
        alert("❌ Error: " + err.message);
      }
    });
  }
});
