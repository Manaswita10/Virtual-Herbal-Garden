import { getPresignedUrls } from '/lib/s3.js';

export default async function handler(req, res) {
  const { modelBasePath } = req.query;

  if (!modelBasePath) {
    return res.status(400).json({ error: 'modelBasePath is required' });
  }

  try {
    console.log(`Generating pre-signed URLs for modelBasePath: ${modelBasePath}`);
    const urls = await getPresignedUrls(modelBasePath);
    console.log('Generated URLs:', urls);
    
    // Set headers to prevent caching
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    
    res.status(200).json(urls);
  } catch (error) {
    console.error('Error generating pre-signed URLs:', error);
    res.status(500).json({ error: 'An error occurred while generating pre-signed URLs' });
  }
}