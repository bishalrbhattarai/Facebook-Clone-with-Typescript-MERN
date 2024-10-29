import mongoose from "mongoose";

export interface CommentDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  content: string;
  time: Date;
}

export const commentSchema = new mongoose.Schema<CommentDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

const commentModel = mongoose.model<CommentDocument>("Comment", commentSchema);

export default commentModel;
