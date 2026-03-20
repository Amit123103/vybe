import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  caption?: string;
  media: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  hashtags: string[];
  mentions: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  commentsCount: number;
  location?: string;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    caption: { type: String, maxLength: 2200 },
    media: [
      {
        type: { type: String, enum: ['image', 'video'], required: true },
        url: { type: String, required: true },
        thumbnail: { type: String },
      },
    ],
    hashtags: [{ type: String, index: true }],
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    commentsCount: { type: Number, default: 0 },
    location: { type: String },
    isEdited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', PostSchema);
