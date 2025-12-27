const token = localStorage.getItem("token");
if(!token) window.location = "login.html";

const API = "http://localhost:5000";

document.getElementById("logoutBtn").onclick = () => {
    localStorage.clear();
    window.location = "login.html";
};

const slotListDiv = document.getElementById("slotList");
const addSlotForm = document.getElementById("addSlotForm");
const slotSearchInput = document.getElementById("slotSearch"); 


async function loadSlots() {
    slotListDiv.innerHTML = "Loading slots...";
    try {
        const res = await fetch(`${API}/doctor/my-slots`, {
            headers: { "Authorization": "Bearer " + token }
        });
        const slots = await res.json();
        slotListDiv.innerHTML = "";

        if(slots.length === 0) slotListDiv.innerHTML = "<p>No slots available</p>";

        slots.forEach(slot => {
            const div = document.createElement("div");
            div.classList.add("slot-item");
            div.dataset.date = slot.date; 
            div.innerHTML = `
                <strong>${slot.date} ${slot.time}</strong>
                <p>Status: ${slot.is_booked ? "Booked" : "Available"}</p>
                <p>Patient: ${slot.patient_name || "-"}</p>
            `;
            slotListDiv.appendChild(div);
        });
    } catch(err) {
        console.error(err);
        slotListDiv.innerHTML = "<p>Failed to load slots</p>";
    }
}


addSlotForm.addEventListener("submit", async e => {
    e.preventDefault();
    const date = e.target.date.value;
    const time = e.target.time.value;

    const res = await fetch(`${API}/doctor/slot/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ date, time })
    });
    const data = await res.json();
    alert(data.message || data.error);
    addSlotForm.reset();
    loadSlots();
});


setInterval(() => {
    loadSlots();
}, 30000);


slotSearchInput?.addEventListener("input", () => {
    const filter = slotSearchInput.value.toLowerCase();
    const slots = document.querySelectorAll(".slot-item");
    slots.forEach(slot => {
        const date = slot.dataset.date.toLowerCase();
        slot.style.display = date.includes(filter) ? "" : "none";
    });
});


loadSlots();
