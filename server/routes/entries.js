const express = require("express");
const router = express.Router();
const Entry = require("../models/Entry");

// GET /api/entries - récupérer toutes les entrées, les plus récentes d'abord
router.get("/", async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/entries - créer une nouvelle entrée
router.post("/", async (req, res) => {
  try {
    const { date, vehicule, depense, gain } = req.body;
    const newEntry = new Entry({ date, vehicule, depense, gain });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/entries/:id - supprimer une entrée
router.delete("/:id", async (req, res) => {
  try {
    await Entry.findByIdAndDelete(req.params.id);
    res.json({ message: "Entrée supprimée" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
