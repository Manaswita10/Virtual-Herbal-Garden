import dbConnect from '/lib/mongodb.js';
import Blog from '/models/Blog.js';
import { verifyToken } from '/utils/auth.js';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);

    if (method === 'POST') {
      const { content } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      const post = await Blog.findById(id);

      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }

      const newComment = {
        author: decoded.id,
        content: content.trim(),
      };

      post.comments.push(newComment);
      await post.save();

      // Populate the author information for the new comment
      const populatedPost = await Blog.findById(id)
        .populate('comments.author', 'name');

      const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

      res.status(201).json({ message: 'Comment added successfully', comment: addedComment });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in /api/posts/[id]/comments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}