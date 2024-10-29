import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  email: string;
  password: string;
  avatar: string;
  friends: mongoose.Types.ObjectId[];
  friendRequests: mongoose.Types.ObjectId[];
  pendingFriends: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  cover: string;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "https://i.sstatic.net/l60Hf.png",
    },
    cover: {
      type: String,
      default: "https://jkfenner.com/wp-content/uploads/2019/11/default.jpg",
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pendingFriends: [{ type: mongoose.Schema.Types.ObjectId }],
    friends: [{ type: mongoose.Schema.Types.ObjectId }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId }],
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<Boolean> {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model<UserDocument>("User", userSchema);
export default userModel;
