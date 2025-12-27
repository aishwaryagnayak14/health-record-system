const slotListDiv = document.getElementById("slotList");
const doctorListDiv = document.getElementById("doctorList");
const token = localStorage.getItem("token");

if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
}

// Load doctors
async function loadDoctors(query="") {
    doctorListDiv.innerHTML = "";
    const res = await fetch(`http://localhost:5000/patient/search?q=${query}`, {
        headers: { "Authorization": "Bearer " + token }
    });
    const doctors = await res.json();

    if(!doctors.length) doctorListDiv.innerHTML = "<p>No doctors found</p>";

    doctors.forEach(doc => {
        const div = document.createElement("div");
        div.style.margin = "5px 0";
        div.innerHTML = `${doc.name} (${doc.specialization}) <button onclick="loadSlots(${doc.doctor_id})">View Slots</button>`;
        doctorListDiv.appendChild(div);
    });
}


async function loadSlots(doctorId) {
    slotListDiv.innerHTML = "Loading slots...";
    try {
        const res = await fetch(`http://localhost:5000/patient/slots/${doctorId}`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const slots = await res.json();

        slotListDiv.innerHTML = "";
        if (!slots.length) {
            slotListDiv.innerHTML = "<p>No available slots</p>";
            return;
        }

        slots.forEach(slot => {
            const div = document.createElement("div");
            div.style.margin = "5px 0";

            const bookBtn = document.createElement("button");
            bookBtn.innerText = "Book";
            bookBtn.onclick = () => bookSlot(slot.id, doctorId);

            div.innerHTML = `${slot.date} ${slot.time} `;
            div.appendChild(bookBtn);
            slotListDiv.appendChild(div);
        });
    } catch(err) {
        console.error(err);
        slotListDiv.innerHTML = "<p>Failed to load slots</p>";
    }
}


async function bookSlot(slotId, doctorId) {
    const amount = prompt("Enter amount to pay:");
    const card = prompt("Enter dummy card number:");

    if(!amount || !card) {
        alert("Payment info required");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/patient/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ doctor_id: doctorId, slot_id: slotId, amount, card })
        });
        const data = await res.json();
        if(data.error) alert(data.error);
        else {
            alert(data.message);
            loadSlots(doctorId); 
        }
    } catch(err) {
        console.error(err);
        alert("Failed to book slot");
    }
}


document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    loadDoctors(query);
});


loadDoctors();


document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});
