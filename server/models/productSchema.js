const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);