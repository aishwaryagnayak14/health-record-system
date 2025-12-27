const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../db");
const SECRET = "your_secret_key";


router.post("/register", (req, res) => {
  const { name, email, password, role, specialization, experience, age, gender } = req.body;

  if (!name || !email || !password || !role) {
    return res.json({ error: "All fields required" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, existingUser) => {
    if (err) return res.status(500).json({ error: err.message });
    if (existingUser) return res.json({ error: "User already exists" });

    db.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, role],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });

        const userId = this.lastID;

        if (role === "doctor") {
          if (!specialization || !experience) return res.json({ error: "Specialization & experience required" });

          db.run(
            "INSERT INTO doctors (user_id, specialization, experience) VALUES (?, ?, ?)",
            [userId, specialization, experience],
            err => {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ message: "Doctor registered successfully" });
            }
          );
        } else if (role === "patient") {
          if (!age || !gender) return res.json({ error: "Age & gender required" });

          db.run(
            "INSERT INTO patients (user_id, age, gender) VALUES (?, ?, ?)",
            [userId, age, gender],
            err => {
              if (err) return res.status(500).json({ error: err.message });
              res.json({ message: "Patient registered successfully" });
            }
          );
        } else {
          res.json({ message: "Registered successfully" });
        }
      }
    );
  });
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user || user.password !== password) return res.json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1h" });

    res.json({ token, role: user.role, userId: user.id });
  });
});

module.exports = router;
