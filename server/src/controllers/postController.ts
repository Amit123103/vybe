import { Request, Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';

export const createPost = async (req: any, res: Response) => {
  try {
    const { caption, media, location } = req.body;

    const post = await Post.create({
      user: req.user._id,
      caption,
      media,
      location,
    });

    // Update user post count
    await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });

    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // In a real app, this would be posts from followed users. 
    // For now, get all posts for the "Vybe" shared feed experience.
    const posts = await Post.find()
      .populate('user', 'username displayName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      data: posts,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likesCount: post.likes.length, isLiked: !isLiked });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username displayName avatar');
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
