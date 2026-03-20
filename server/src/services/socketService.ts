import { Server, Socket } from 'socket.io';
import Message from '../models/Message';
import Notification from '../models/Notification';

class SocketService {
  private io: Server | null = null;
  private users: Map<string, string> = new Map(); // userId -> socketId

  init(io: Server) {
    this.io = io;

    this.io.on('connection', (socket: Socket) => {
      console.log('⚡ User connected:', socket.id);

      socket.on('join', (userId: string) => {
        this.users.set(userId, socket.id);
        console.log(`👤 User ${userId} joined with socket ${socket.id}`);
      });

      socket.on('send_message', async (data: any) => {
        try {
          const { sender, receiver, content, type, postId } = data;
          
          const newMessage = await Message.create({
            sender,
            receiver,
            content,
            type,
            postId
          });

          const populatedMessage = await newMessage.populate([
            { path: 'sender', select: 'username displayName avatar' },
            { path: 'receiver', select: 'username displayName avatar' }
          ]);

          const receiverSocketId = this.users.get(receiver);
          if (receiverSocketId) {
            this.io?.to(receiverSocketId).emit('receive_message', populatedMessage);
          }
          
          // Also send back to sender for confirmation
          socket.emit('message_sent', populatedMessage);
        } catch (error) {
          console.error('❌ Error sending message:', error);
        }
      });

      socket.on('disconnect', () => {
        for (const [userId, socketId] of this.users.entries()) {
          if (socketId === socket.id) {
            this.users.delete(userId);
            break;
          }
        }
        console.log('👤 User disconnected');
      });
    });
  }

  sendNotification(recipientId: string, notification: any) {
    const socketId = this.users.get(recipientId);
    if (socketId) {
      this.io?.to(socketId).emit('new_notification', notification);
    }
  }
}

export const socketService = new SocketService();
