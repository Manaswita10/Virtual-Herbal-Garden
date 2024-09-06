const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  botanicalName: {
    type: String,
    required: true,
  },
  commonNames: {
    type: String,  // Common names stored as a single string
  },
  habitat: {
    type: String,
  },
  medicinalUses: {
    type: String,  // Medicinal uses stored as a single string
  },
  medicinalRecipe: {
    type: String,  // Medicinal recipes stored as a single string
  },
  methodsOfCultivation: {
    type: String,  // Cultivation methods stored as a single string
  },
  videos: {
    type: [String],  // URLs of videos stored as an array of strings
  },
});

module.exports = mongoose.models.Plant || mongoose.model('Plant', PlantSchema);
