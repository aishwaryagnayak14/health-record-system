
const token = localStorage.getItem("token");
if (!token) window.location = "login.html";


document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.clear();
    window.location = "login.html";
});


const API = "http://localhost:5000";


async function loadUsers() {
    try {
        const res = await fetch(`${API}/admin/users`, { 
            headers: { "Authorization": "Bearer " + token } 
        });
        const users = await res.json();

        
        const doctorTable = document.getElementById("doctorTable");
        doctorTable.innerHTML = `<tr><th>Name</th><th>Email</th><th>Specialization</th><th>Experience</th></tr>`;
        users.filter(u => u.role === "doctor").forEach(d => {
            doctorTable.innerHTML += `<tr>
                <td>${d.name}</td>
                <td>${d.email}</td>
                <td>${d.specialization}</td>
                <td>${d.experience}</td>
            </tr>`;
        });

        
        const patientTable = document.getElementById("patientTable");
        patientTable.innerHTML = `<tr><th>Name</th><th>Email</th><th>Age</th><th>Gender</th></tr>`;
        users.filter(u => u.role === "patient").forEach(p => {
            patientTable.innerHTML += `<tr>
                <td>${p.name}</td>
                <td>${p.email}</td>
                <td>${p.age}</td>
                <td>${p.gender}</td>
            </tr>`;
        });
    } catch (err) {
        console.error("Failed to load users:", err);
    }
}


async function loadAppointments() {
    try {
        const res = await fetch(`${API}/admin/appointments`, { 
            headers: { "Authorization": "Bearer " + token } 
        });
        const appointments = await res.json();
        const table = document.getElementById("appointmentsTable");
        table.innerHTML = `<tr><th>Doctor</th><th>Patient</th><th>Date</th><th>Time</th></tr>`;
        appointments.forEach(a => {
            table.innerHTML += `<tr>
                <td>${a.doctor_name}</td>
                <td>${a.patient_name || "-"}</td>
                <td>${a.date}</td>
                <td>${a.time}</td>
            </tr>`;
        });
    } catch (err) {
        console.error("Failed to load appointments:", err);
    }
}


loadUsers();
loadAppointments();


setInterval(() => {
    loadUsers();
    loadAppointments();
}, 30000);


const doctorSearchInput = document.getElementById("doctorSearch");
doctorSearchInput?.addEventListener("input", () => {
    const filter = doctorSearchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#doctorTable tr:not(:first-child)");
    rows.forEach(row => {
        const name = row.cells[0].innerText.toLowerCase();
        row.style.display = name.includes(filter) ? "" : "none";
    });
});

const patientSearchInput = document.getElementById("patientSearch");
patientSearchInput?.addEventListener("input", () => {
    const filter = patientSearchInput.value.toLowerCase();
    const rows = document.querySelectorAll("#patientTable tr:not(:first-child)");
    rows.forEach(row => {
        const name = row.cells[0].innerText.toLowerCase();
        row.style.display = name.includes(filter) ? "" : "none";
    });
});
