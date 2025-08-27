// Old Features
document.addEventListener("DOMContentLoaded", () => {
  // Copy text
  const copyBtn = document.getElementById("copyText");
  if(copyBtn){
    copyBtn.addEventListener("click", async ()=>{
      const text = `🌸✨ शुभ राधाष्टमी महोत्सव एवं व्रातिका जन्मोत्सव का आमंत्रण ✨🌸\n\n`+
      `🍲 भंडारा प्रसाद – दोपहर 12:00 बजे\n🎶 कीर्तन – सायं 7:30 बजे\n📅 तिथि – 31 अगस्त (रविवार)\n📍 स्थान – बाबा चितरु कॉम्प्लेक्स, सेक्टर 52, वज़ीराबाद\n\nसप्रेम आमंत्रण\nआयोजक परिवार`;
      try{
        await navigator.clipboard.writeText(text);
        copyBtn.textContent="Copied ✓";
        setTimeout(()=>copyBtn.textContent="Copy Invite Text",1800);
      }catch(e){alert("Copy failed");}
    });
  }

  // Save image
  const saveBtn = document.getElementById("saveImage");
  if(saveBtn){
    saveBtn.addEventListener("click",()=>{
      const img=document.querySelector(".lower-img img");
      if(img && img.src) window.open(img.src,"_blank");
    });
  }

  // Hide scroll indicator after few sec
  const indicator=document.querySelector(".scroll-indicator");
  if(indicator){
    setTimeout(()=>indicator.style.display="none",7000);
  }

  // Init petals
  initPetals();

  // Change overlay text dynamically
  initOverlayText();
});

function initPetals(){
  const wrap=document.getElementById("petalWrap");
  if(!wrap) return;
  for(let i=0;i<12;i++){
    spawnPetal(wrap);
  }
  setInterval(()=>spawnPetal(wrap),1500);
}
function spawnPetal(wrap){
  const p=document.createElement("div");
  p.className="petal";
  p.style.left=(Math.random()*100)+"%";
  p.style.top="-5%";
  const dur=6+Math.random()*8;
  p.style.animation=`floatPetal ${dur}s linear forwards`;
  p.style.transform=`rotate(${Math.random()*120}deg)`;
  wrap.appendChild(p);
  setTimeout(()=>{try{wrap.removeChild(p);}catch(e){}},(dur+1)*1000);
}

function initOverlayText(){
  const msgs=[
    "आपका स्वागत है — प्रेम व भक्ति में आमंत्रण",
    "विशेष भंडारा और सांस्कृतिक कीर्तन में शामिल हों",
    "सपरिवार पधारें और आशीर्वाद प्राप्त करें"
  ];
  const line1=document.getElementById("line1");
  const line2=document.getElementById("line2");
  let i=0;
  setInterval(()=>{
    i=(i+1)%msgs.length;
    if(line1 && line2){
      line1.textContent=msgs[i];
      line2.textContent=msgs[(i+1)%msgs.length];
    }
  },3500);
}

// ====================== Firebase RSVP ======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

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

// RSVP Logic
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("rsvpOverlay");
  const form = document.getElementById("rsvpForm");
  const thankyou = document.getElementById("thankyouPopup");

  // Check if already RSVP done
  const alreadyDone = localStorage.getItem("rsvpDone");

  // Show popup on scroll to bottom (only if not already done)
  if(!alreadyDone){
    window.addEventListener("scroll", () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        overlay.style.display = "flex";
      }
    });
  }

  // Form submit → Save to Firebase
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        coming: form.coming.value,
        name: form.name.value,
        count: form.count.value,
        timestamp: new Date().toISOString()
      };
      try {
        const responsesRef = ref(db, "rsvpResponses");
        const newRef = push(responsesRef);
        await set(newRef, data);

        // Save status in localStorage
        localStorage.setItem("rsvpDone", "true");

        // Hide RSVP form
        overlay.style.display = "none";

        // Show Thank You popup
        if(thankyou){
          thankyou.style.display = "flex";
          setTimeout(()=>{ thankyou.style.display="none"; }, 4000);
        }
      } catch (err) {
        alert("❌ Failed to save: " + err.message);
      }
    });
  }
});
