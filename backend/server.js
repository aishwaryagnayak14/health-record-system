const express = require("express");
const cors = require("cors");
const app = express();

// Use dynamic port assigned by Railway
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const doctorRoutes = require("./routes/doctor");
const patientRoutes = require("./routes/patient");

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
