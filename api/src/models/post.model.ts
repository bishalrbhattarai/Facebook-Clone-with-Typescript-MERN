import mongoose from "mongoose";
import { commentSchema, CommentDocument } from "./comment.model";
interface PostDocument extends mongoose.Document {
  caption: string;
  time: Date;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: CommentDocument[];
  images?: string[]; // URLs of images or videos
}

const postSchema = new mongoose.Schema<PostDocument>({
  caption: {
    type: String,
    required: false,
  },
  time: {
    type: Date,
    default: Date.now,
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: 0,
    },
  ],
  comments: [commentSchema],

  images: {
    type: [String],
    default: [],
  },
});

const postModel = mongoose.model<PostDocument>("Post", postSchema);
export default postModel;
