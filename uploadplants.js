require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const mongoose = require('mongoose');
const Plant = require('./Virtual-Herbal-Garden/lib/models/Plant');
const dbConnect = require('./Virtual-Herbal-Garden/lib/mongodb');

dbConnect().then(() => {
  console.log('Connected to MongoDB');
  const csvFilePath = path.join(__dirname, 'data', 'plants.csv');

  csv()
    .fromFile(csvFilePath)
    .then(async (jsonObj) => {
      console.log('Parsed CSV:', jsonObj); // Add this line to see the parsed CSV data

      try {
        // Replace the existing validPlants definition with this new code
        const validPlants = jsonObj
          .filter(plant => plant.botanicalName && plant.botanicalName.trim() !== '')
          .map(plant => ({
            botanicalName: plant.botanicalName,
            commonNames: plant.commonNames,
            habitat: plant.habitat,
            medicinalUses: plant.medicinalUses,
            medicinalRecipe: plant.medicinalRecipe,
            methodsOfCultivation: plant.methodsOfCultivation,
            videos: plant.videos ? plant.videos.split(',') : []
          }));

        const invalidPlants = jsonObj.filter(plant => !plant.botanicalName || plant.botanicalName.trim() === '');

        console.log('Total plants in CSV:', jsonObj.length);
        console.log('Valid plants:', validPlants.length);
        console.log('Invalid plants:', invalidPlants.length);

        if (invalidPlants.length > 0) {
          console.warn(`Warning: ${invalidPlants.length} plants were skipped due to missing botanical names.`);
        }

        if (validPlants.length > 0) {
          await Plant.insertMany(validPlants, { ordered: false });
          console.log(`Successfully uploaded ${validPlants.length} plants.`);
        } else {
          console.log('No valid plants to upload.');
        }
      } catch (err) {
        console.error('Error uploading plants:', err);
        if (err.writeErrors) {
          err.writeErrors.forEach((writeError, index) => {
            console.error(`Error ${index + 1}:`, writeError.errmsg);
          });
        }
      } finally {
        mongoose.connection.close();
      }
    });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});