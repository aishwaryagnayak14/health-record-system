const API = "http://localhost:5000";


async function getDoctors(q = "") {
    const res = await fetch(`${API}/doctor/search?q=${q}`);
    return await res.json();
}


function renderDoctors(doctors, container) {
    container.innerHTML = "";

    if (!doctors.length) {
        container.innerHTML = "<p>No doctors found</p>";
        return;
    }

    doctors.forEach(d => {
        const div = document.createElement("div");
        div.style.border = "1px solid #ccc";
        div.style.padding = "10px";
        div.style.marginTop = "10px";

        div.innerHTML = `
            <h4>Dr. ${d.name}</h4>
            <p><b>Specialization:</b> ${d.specialization}</p>
            <button onclick="loadSlots(${d.id})">View Slots</button>
        `;

        container.appendChild(div);
    });
}
