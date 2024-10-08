import dbConnect from '/lib/mongodb.js';
import Doctor from '/models/Doctor.js';

export default async function handler(req, res) {
  await dbConnect();

  try {
    const doctors = await Doctor.find({});
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch doctors' });
  }
}