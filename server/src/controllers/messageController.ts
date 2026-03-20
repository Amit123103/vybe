import { Request, Response } from 'express';
import Message from '../models/Message';

export const getMessages = async (req: any, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'username displayName avatar')
      .populate('receiver', 'username displayName avatar');

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req: any, res: Response) => {
  try {
    const currentUserId = req.user._id;

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'username displayName avatar')
      .populate('receiver', 'username displayName avatar');

    // Group by conversation partner
    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const partner = msg.sender._id.toString() === currentUserId.toString() ? msg.receiver : msg.sender;
      const partnerId = (partner as any)._id.toString();

      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          user: partner,
          lastMessage: msg,
        });
      }
    });

    res.json(Array.from(conversationsMap.values()));
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const markAsRead = async (req: any, res: Response) => {
  try {
    await Message.updateMany(
      { receiver: req.user._id, sender: req.params.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
