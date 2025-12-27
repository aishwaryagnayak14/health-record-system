const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const db = require("../db");

router.use(verifyToken);


router.post("/slot/add", (req, res) => {
  if (req.user.role !== "doctor") return res.status(403).json({ error: "Access denied" });
  const { date, time } = req.body;

  db.get("SELECT id FROM doctors WHERE user_id = ?", [req.user.id], (err, doctor) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!doctor) return res.json({ error: "Doctor profile not found" });

    db.run(
      "INSERT INTO slots (doctor_id, date, time) VALUES (?, ?, ?)",
      [doctor.id, date, time],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Slot added successfully" });
      }
    );
  });
});


router.get("/my-slots", (req, res) => {
  if (req.user.role !== "doctor") return res.status(403).json({ error: "Access denied" });

  db.get("SELECT id FROM doctors WHERE user_id = ?", [req.user.id], (err, doctor) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!doctor) return res.json({ error: "Doctor profile not found" });

    const query = `
      SELECT s.id, s.date, s.time, s.is_booked,
             u.name AS patient_name
      FROM slots s
      LEFT JOIN appointments a ON s.id = a.slot_id
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE s.doctor_id = ?
      ORDER BY s.date ASC, s.time ASC
    `;

    db.all(query, [doctor.id], (err, slots) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(slots);
    });
  });
});


router.get("/search", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const q = req.query.q?.toLowerCase() || "";
  const query = `
    SELECT u.id, u.name, d.specialization, d.experience
    FROM users u
    JOIN doctors d ON u.id = d.user_id
    WHERE u.role='doctor' AND LOWER(u.name) LIKE ?
  `;
  db.all(query, [`%${q}%`], (err, doctors) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(doctors);
  });
});


router.get("/slots/:doctorId", (req, res) => {
  const doctorId = parseInt(req.params.doctorId);
  const query = `
    SELECT s.id, s.date, s.time, s.is_booked
    FROM slots s
    WHERE s.doctor_id = ? AND s.is_booked = 0
    ORDER BY s.date ASC, s.time ASC
  `;
  db.all(query, [doctorId], (err, slots) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(slots);
  });
});

module.exports = router;
