const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const db = require("../db");

router.use(verifyToken);


router.get("/search", (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  const query = `
    SELECT d.id AS doctor_id, u.name, d.specialization, d.experience
    FROM users u
    JOIN doctors d ON u.id = d.user_id
    WHERE u.role='doctor' AND LOWER(u.name) LIKE ?
  `;
  db.all(query, [`%${q}%`], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.get("/slots/:doctorId", (req, res) => {
  const doctorId = parseInt(req.params.doctorId);
  const query = "SELECT id, date, time FROM slots WHERE doctor_id=? AND is_booked=0 ORDER BY date ASC, time ASC";
  db.all(query, [doctorId], (err, rows) => {
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


router.post("/book", (req, res) => {
  if(req.user.role !== "patient") return res.status(403).json({ error: "Access denied" });
  const { doctor_id, slot_id, amount, card } = req.body;

  if(!amount || !card) return res.json({ error: "Payment info required" });

  
  console.log(`Dummy Payment: Amount ${amount}, Card ${card}`);

  db.get("SELECT id FROM patients WHERE user_id = ?", [req.user.id], (err, patient) => {
    if(err) return res.status(500).json({ error: err.message });
    if(!patient) return res.json({ error: "Patient profile not found" });

    db.get("SELECT * FROM slots WHERE id = ? AND is_booked = 0", [slot_id], (err, slot) => {
      if(err) return res.status(500).json({ error: err.message });
      if(!slot) return res.json({ error: "Slot already booked or not found" });

      db.run("INSERT INTO appointments (doctor_id, patient_id, slot_id) VALUES (?, ?, ?)",
        [doctor_id, patient.id, slot_id], err => {
          if(err) return res.status(500).json({ error: err.message });

          db.run("UPDATE slots SET is_booked = 1 WHERE id = ?", [slot_id], err => {
            if(err) return res.status(500).json({ error: err.message });
            res.json({ message: "Appointment booked successfully" });
          });
        });
    });
  });
});

module.exports = router;
