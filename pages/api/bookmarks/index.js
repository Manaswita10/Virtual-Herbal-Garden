import dbConnect from '/lib/mongodb';
import Bookmark from '/models/Bookmark';
import Plant from '/models/Plant';
import { verifyToken } from '/utils/auth.js';
import { getPresignedUrls } from '/lib/s3.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  await dbConnect();

  try {
    const decodedToken = verifyToken(token);
    const userId = decodedToken.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (req.method === 'GET') {
      const bookmarks = await Bookmark.find({ userId: new mongoose.Types.ObjectId(userId) })
        .populate('plantId')
        .lean();

      const bookmarkedPlants = await Promise.all(bookmarks.map(async (bookmark) => {
        const plant = bookmark.plantId;
        if (plant && plant.modelBasePath) {
          try {
            const urls = await getPresignedUrls(plant.modelBasePath);
            const imageUrl = Object.entries(urls).find(([key, value]) => {
              const lowerKey = key.toLowerCase();
              return (lowerKey.endsWith('.jpg') || lowerKey.endsWith('.png') || lowerKey.endsWith('.jpeg')) && 
                     !lowerKey.includes('/textures/') &&
                     lowerKey.split('/').length === 2;
            });
            if (imageUrl) {
              return { ...plant, imageUrl: imageUrl[1], isBookmarked: true };
            }
          } catch (error) {
            console.error(`Error generating pre-signed URLs for ${plant.name}:`, error);
          }
        }
        return { ...plant, isBookmarked: true };
      }));

      res.status(200).json(bookmarkedPlants);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Fetch bookmarks error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}