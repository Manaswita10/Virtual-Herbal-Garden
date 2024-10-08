import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import Plant from './models/Plant.js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://arshaviroy:motapodu2003@ayushplantsdb.mqaql.mongodb.net/';

async function uploadPlants() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const csvFilePath = path.join(__dirname, '/data/asiaplants.csv');
    const plants = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => plants.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    await Plant.insertMany(plants);
    console.log('CSV data successfully uploaded to MongoDB!');
  } catch (error) {
    console.error('Error uploading CSV data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

uploadPlants().catch(console.error);