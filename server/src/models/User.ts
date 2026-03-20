import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  displayName: string;
  avatar?: string;
  coverPhoto?: string;
  bio?: string;
  website?: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  postsCount: number;
  googleId?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, select: false },
    displayName: { type: String, required: true },
    avatar: { type: String },
    coverPhoto: { type: String },
    bio: { type: String, maxLength: 160 },
    website: { type: String },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    postsCount: { type: Number, default: 0 },
    googleId: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>('save', async function () {
  const user = this;
  if (!user.isModified('password')) return;
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password as string, salt);
  } catch (err: any) {
    throw err;
  }
});

UserSchema.methods.comparePassword = async function (password: string) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
