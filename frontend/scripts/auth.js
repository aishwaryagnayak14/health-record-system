const API = "http://localhost:5000";

document.getElementById("loginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch(`${API}/auth/login`, {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if(data.token){
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if(data.role === "doctor") window.location="doctor_dashboard.html";
        else if(data.role === "patient") window.location="patient_dashboard.html";
        else if(data.role === "admin") window.location="admin_dashboard.html";
    } else {
        alert(data.error);
    }
});

document.getElementById("registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch(`${API}/auth/register`, {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || data.error);
    if(data.message) window.location="login.html";
});
