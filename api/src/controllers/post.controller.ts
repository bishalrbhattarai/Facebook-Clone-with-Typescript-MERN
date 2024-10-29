import { Request, Response } from "express";
import { cloudinary } from "../middleware/cloudinary";
import fs from "fs";
import postModel from "../models/post.model";
import commentModel from "../models/comment.model";

export const createPost = async (req: Request, res: Response): Promise<any> => {
  try {
    const { caption } = req.body;
    console.log(req.files);

    if (!req.files || req.files.length === 0) {
      const post = await postModel.create({
        caption,
        author: req.user.id,
      });

      if (post)
        return res.status(201).json({ success: true, message: "Post Created" });
      else
        return res
          .status(500)
          .json({ success: false, message: "Post not Created" });
    } else {
      const imageUploadPromises = (req.files as Express.Multer.File[]).map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
              file.path,
              { folder: "posts" },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  // Remove file after upload to Cloudinary
                  fs.unlinkSync(file.path);
                  resolve(result?.secure_url);
                }
              }
            );
          })
      );

      const imageUrls = await Promise.all(imageUploadPromises);

      if (imageUrls) {
        const post = await postModel.create({
          caption,
          author: req.user.id,
          images: imageUrls,
        });

        return res
          .status(201)
          .json({ success: true, message: "Post Created Successfully" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<any> => {
  try {
    const posts = await postModel
      .find()
      .populate("author", "avatar firstName lastName -_id")
      .populate("comments.userId", "avatar firstName lastName ");
    console.log(posts);
    res.status(200).json(posts);
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

export const addComment = async (req: Request, res: Response): Promise<any> => {
  const { userId, content, postId } = req.body;
  try {
    const comment = await commentModel.create({
      userId,
      content,
    });

    await postModel.findByIdAndUpdate(postId, {
      $push: {
        comments: comment,
      },
    });
    const populatedComment = await comment.populate(
      "userId",
      "firstName lastName avatar"
    );

    res.status(201).json({
      success: true,
      message: "The Added Comment Structure is:",
      comment: populatedComment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

export const likePost = async (req: Request, res: Response): Promise<any> => {
  const { postId, userId } = req.body;

  try {
    // Find the post by ID
    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if userId is already in the likes array
    const userIndex = post.likes.indexOf(userId);

    if (userIndex !== -1) {
      // User is already in the likes array, remove them
      post.likes.splice(userIndex, 1);
    } else {
      // User is not in the likes array, add them
      post.likes.push(userId);
    }

    // Save the updated post
    await post.save();

    return res.status(200).json({
      success: true,
      message:
        userIndex !== -1
          ? "Post unliked successfully"
          : "Post liked successfully",
      value: post.likes, // Return the updated likes count if needed
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  }
};
