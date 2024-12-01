// pages/api/posts/[id].js

import dbConnect from '/lib/mongodb';
import Blog from '/models/Blog';
import { verifyToken } from '/utils/auth';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);

    if (method === 'DELETE') {
      // Find the post and check if it belongs to the user
      const post = await Blog.findById(id);
      
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.author.toString() !== decoded.id) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      // Delete the post
      await Blog.findByIdAndDelete(id);
      
      res.status(200).json({ message: 'Post deleted successfully' });
    } else {
      res.setHeader('Allow', ['DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in /api/posts/[id]:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}