const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // ✅ must be at top

const app = express();
const Routes = require("./routes/route.js");

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cors());

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.log("❌ DB Connection Error:", err);
  }
})();

app.use("/", Routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});