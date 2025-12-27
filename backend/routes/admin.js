const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const db = require("../db");

router.use(verifyToken);


router.use((req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Access denied" });
    next();
});


router.get("/users", (req, res) => {
    const query = `
        SELECT u.id, u.name, u.email, u.role,
               p.age, p.gender,
               d.specialization, d.experience
        FROM users u
        LEFT JOIN patients p ON p.user_id = u.id
        LEFT JOIN doctors d ON d.user_id = u.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


router.get("/appointments", (req, res) => {
    const query = `
        SELECT a.id,
               u1.name AS doctor_name,
               u2.name AS patient_name,
               s.date,
               s.time
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN users u1 ON d.user_id = u1.id
        LEFT JOIN patients p ON a.patient_id = p.id
        LEFT JOIN users u2 ON p.user_id = u2.id
        JOIN slots s ON a.slot_id = s.id
        ORDER BY s.date ASC, s.time ASC
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

module.exports = router;
