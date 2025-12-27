const token = localStorage.getItem("token");
if(!token) window.location="login.html";

document.getElementById("logoutBtn")?.addEventListener("click", ()=>{
    localStorage.clear();
    window.location="login.html";
});

const API = "http://localhost:5000";

const params = new URLSearchParams(window.location.search);
const doctorId = params.get("doctorId");

async function loadSlots(){
    const res = await fetch(`${API}/patient/slots/${doctorId}`, {
        headers: {"Authorization":"Bearer "+token}
    });
    const slots = await res.json();
    const table = document.getElementById("slotTable");
    table.innerHTML = `<tr><th>Date</th><th>Time</th><th>Action</th></tr>`;
    slots.forEach(s=>{
        table.innerHTML += `<tr>
            <td>${s.date}</td>
            <td>${s.time}</td>
            <td><button onclick="book(${s.id})">Book</button></td>
        </tr>`;
    });
}

async function book(slotId){
    const res = await fetch(`${API}/appointment/book`, {
        method:"POST",
        headers: {"Content-Type":"application/json","Authorization":"Bearer "+token},
        body: JSON.stringify({slot_id: slotId, doctor_id: doctorId})
    });
    const data = await res.json();
    alert(data.message || data.error);
    loadSlots();
}

loadSlots();
