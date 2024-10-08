import dbConnect from '/lib/mongodb.js';
import Blog from '/models/Blog.js';
import User from '/models/User.js';  // Make sure you have a User model
import { verifyToken } from '/utils/auth.js';
import multer from 'multer';
import path from 'path';
import { promisify } from 'util';

const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports images"));
  }
});

const uploadMiddleware = promisify(upload.array('images', 3));

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);

    if (req.method === 'GET') {
      const posts = await Blog.find()
        .populate('author', 'name')
        .populate('comments.author', 'name')
        .sort({ createdAt: -1 });  // Sort by newest first

      const postsWithLikeInfo = await Promise.all(posts.map(async (post) => {
        const postObject = post.toObject();
        postObject.likesCount = post.likes.length;
        postObject.userLiked = post.likes.includes(decoded.id);
        return postObject;
      }));

      res.status(200).json(postsWithLikeInfo);

    } else if (req.method === 'POST') {
      await uploadMiddleware(req, res);
      
      const { review } = req.body;
      
      if (!review) {
        return res.status(400).json({ message: 'Review is required' });
      }

      const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      const newPost = new Blog({
        author: decoded.id,
        review,
        images,
        likes: [],  // Initialize likes as an empty array
        likesCount: 0,  // Initialize likesCount as 0
      });

      await newPost.save();

      // Populate author information before sending response
      await newPost.populate('author', 'name');

      res.status(201).json({ 
        message: 'Post created successfully', 
        post: {
          ...newPost.toObject(),
          userLiked: false,
          likesCount: 0
        }
      });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in /api/posts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}