import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as tf from '@tensorflow/tfjs';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = 'virtual-herbal-garden-3d-models';
const modelKey = 'trained_models/model.json';

let model;
const labelEncoder = ['Amla', 'Tulsi', 'Neem', 'Ashwagandha']; // Replace with your actual plant labels

async function loadModel() {
  if (!model) {
    try {
      console.log('Starting to load model...');
      const modelCommand = new GetObjectCommand({ Bucket: bucketName, Key: modelKey });
      const modelUrl = await getSignedUrl(s3Client, modelCommand, { expiresIn: 3600 });
      
      // Explicitly set the input shape
      const inputShape = [null, 224, 224, 3];
      model = await tf.loadLayersModel(modelUrl, { inputShape: inputShape });
      
      console.log('Model loaded successfully');
      console.log('Model summary:', model.summary());
    } catch (error) {
      console.error('Error loading model:', error);
      throw new Error('Failed to load the model: ' + error.message);
    }
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await loadModel();

    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imageBuffer = Buffer.from(image.split(',')[1], 'base64');

    // Preprocess the image
    const imageTensor = await tf.browser.fromPixels(await createImageBitmap(new Blob([imageBuffer])));
    const resizedTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const expandedTensor = tf.expandDims(resizedTensor, 0);
    const normalizedTensor = expandedTensor.toFloat().div(tf.scalar(255));

    console.log('Image preprocessed, shape:', normalizedTensor.shape);

    // Perform inference
    const predictions = await model.predict(normalizedTensor).data();
    console.log('Raw predictions:', predictions);

    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const predictedLabel = labelEncoder[maxIndex];
    const confidence = predictions[maxIndex];

    // Clean up tensors
    tf.dispose([imageTensor, resizedTensor, expandedTensor, normalizedTensor]);

    res.status(200).json({
      plant: predictedLabel,
      confidence: confidence
    });
  } catch (error) {
    console.error('Error in plant recognition:', error);
    res.status(500).json({ error: 'An error occurred during plant recognition: ' + error.message });
  }
}
