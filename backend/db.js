const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./hospital.db");

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`);

  // Doctors table
  db.run(`CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    specialization TEXT,
    experience INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Patients table
  db.run(`CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    age INTEGER,
    gender TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Slots table
  db.run(`CREATE TABLE IF NOT EXISTS slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER,
    date TEXT,
    time TEXT,
    is_booked INTEGER DEFAULT 0,
    FOREIGN KEY(doctor_id) REFERENCES doctors(id)
  )`);

  // Appointments table
  db.run(`CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_id INTEGER,
    patient_id INTEGER,
    slot_id INTEGER,
    FOREIGN KEY(doctor_id) REFERENCES doctors(id),
    FOREIGN KEY(patient_id) REFERENCES patients(id),
    FOREIGN KEY(slot_id) REFERENCES slots(id)
  )`);
});

module.exports = db;
