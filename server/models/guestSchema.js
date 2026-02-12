const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    contactInfo: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model("Guest", guestSchema);