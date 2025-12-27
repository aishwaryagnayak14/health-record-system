const API = "http://localhost:5000";
const token = localStorage.getItem("token");

if (!token) window.location = "login.html";

async function loadSlots() {
    const res = await fetch(`${API}/appointment/my-slots`, {
        headers: { Authorization: "Bearer " + token }
    });

    const slots = await res.json();
    const table = document.getElementById("slotTable");

    table.innerHTML = `
        <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Patient</th>
        </tr>
    `;

    slots.forEach(s => {
        table.innerHTML += `
            <tr>
                <td>${s.date}</td>
                <td>${s.time}</td>
                <td>${s.is_booked ? "Booked" : "Available"}</td>
                <td>${s.patient_name || "-"}</td>
            </tr>
        `;
    });
}

document.getElementById("addSlotForm").addEventListener("submit", async e => {
    e.preventDefault();

    const date = e.target.date.value;
    const time = e.target.time.value;

    const res = await fetch(`${API}/appointment/slot/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({ date, time })
    });

    const data = await res.json();
    alert(data.message || data.error);
    loadSlots();
});

loadSlots();
