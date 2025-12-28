const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();


const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "frontend"))); 

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const doctorRoutes = require("./routes/doctor");
const patientRoutes = require("./routes/patient");

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/index.html")); 
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
