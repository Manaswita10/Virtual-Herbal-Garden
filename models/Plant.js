import mongoose from 'mongoose';

const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  botanicalName: {
    type: String,
  },
  commonNames: {
    type: [String],
  },
  habitat: {
    type: String,
  },
  medicinalUses: {
    type: String,
  },
  medicinalRecipe: {
    type: String,
  },
  methodsOfCultivation: {
    type: String,
  },
  videos: {
    type: [String], // Assuming URLs for videos
  },
  modelBasePath: {
    type: String,
    required: true,
  },
  continent: {
    type: String,
    required: true,
  },
});

// Check if the model already exists to prevent recompilation
const Plant = mongoose.models.Plant || mongoose.model('Plant', PlantSchema);

export default Plant;