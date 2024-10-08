import dbConnect from '/lib/mongodb';
import Blog from '/models/Blog';
import { verifyToken } from '/utils/auth';

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  await dbConnect();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);

    if (method === 'POST') {
      const post = await Blog.findById(id);

      if (!post) {
        return res.status(404).json({ message: 'Blog post not found' });
      }

      const userId = decoded.id;
      const userLikeIndex = post.likes.indexOf(userId);

      if (userLikeIndex > -1) {
        post.likes.splice(userLikeIndex, 1);
      } else {
        post.likes.push(userId);
      }

      await post.save();

      res.status(200).json({
        message: 'Like updated successfully',
        likesCount: post.likes.length,
        userLiked: post.likes.includes(userId)
      });
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in /api/posts/[id]/like:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}