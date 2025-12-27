const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");


router.post("/book", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { slot_id, doctor_id } = req.body;

    db.get("SELECT id FROM patients WHERE user_id = ?", [userId], (err, patient) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!patient) return res.status(404).json({ error: "Patient not found" });

        db.get("SELECT is_booked FROM slots WHERE id = ? AND doctor_id = ?", [slot_id, doctor_id], (err, slot) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!slot) return res.status(404).json({ error: "Slot not found" });
            if (slot.is_booked) return res.status(400).json({ error: "Slot already booked" });

            db.run("INSERT INTO appointments (doctor_id, patient_id, slot_id) VALUES (?, ?, ?)",
                [doctor_id, patient.id, slot_id], function(err) {
                    if (err) return res.status(500).json({ error: err.message });

                    db.run("UPDATE slots SET is_booked = 1 WHERE id = ?", [slot_id], err => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ message: "Appointment booked successfully" });
                    });
                });
        });
    });
});

module.exports = router;
