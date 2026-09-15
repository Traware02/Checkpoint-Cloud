const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    vehicule: {
      type: String,
      required: true,
      enum: ["Véhicule 1", "Véhicule 2", "Véhicule 3"],
    },
    depense: {
      type: Number,
      required: true,
      default: 0,
    },
    gain: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Entry", entrySchema);
