import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import { cloudinary } from "../middleware/cloudinary";
import postModel from "../models/post.model";

export const searchUserByName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const { search } = req.body;
  console.log(search);

  // Check if the search string is empty or consists only of whitespace
  if (!search || search.trim().length === 0) {
    return res.status(200).json({
      success: true,
      data: [], // Return an empty array if the search term is empty
    });
  }

  try {
    const searchWords = search
      .split(" ")
      .map((word: string) => word.trim())
      .filter(Boolean); // Split and clean up search terms

    // Use $or for the search conditions
    const queryConditions = {
      _id: { $ne: req.user.id }, // Exclude the logged-in user
      $or: searchWords.map((word: string) => ({
        $or: [
          { firstName: { $regex: word, $options: "i" } },
          { lastName: { $regex: word, $options: "i" } },
        ],
      })),
    };

    const users = await userModel.find(queryConditions, {
      avatar: 1,
      _id: 1,
      firstName: 1,
      lastName: 1,
    });

    console.log(users);

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    const user = await userModel.findById(
      id,
      "-password -createdAt -updatedAt"
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log(req.file);
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(filePath, {
      folder: "avatars", // Optional: Set a folder for organization in Cloudinary
    });

    const existingUser = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        avatar: secure_url,
      },
      { new: true, fields: "-password -__v -createdAt -updatedAt" }
    );

    const gender = existingUser?.gender === "male" ? "his" : "her";

    const createdPost = await postModel.create({
      caption: `${existingUser?.firstName} ${existingUser?.lastName} updated ${gender} Profile Picture`,
      images: [secure_url],
      author: req.user.id,
    });

    console.log("Created Post");
    console.log(createdPost);

    console.log("New User");
    console.log(existingUser);

    res.status(201).json({
      success: true,
      message: "Profile Picture Updated",
      user: existingUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

export const updateCover = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    console.log(req.file);
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(filePath, {
      folder: "covers", // Optional: Set a folder for organization in Cloudinary
    });

    const existingUser = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        cover: secure_url,
      },
      { new: true, fields: "-password -__v -createdAt -updatedAt" }
    );

    const gender = existingUser?.gender === "male" ? "his" : "her";

    await postModel.create({
      caption: `${existingUser?.firstName} ${existingUser?.lastName} updated ${gender} Cover Picture`,
      images: [secure_url],
      author: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Cover Picture Updated",
      user: existingUser,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};

export const cancelFriendRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  const targetUserId = req.body.friendId;
  const loggedInUserId = req.user.id;

  try {
    await userModel.findByIdAndUpdate(targetUserId, {
      $pull: {
        friendRequests: loggedInUserId,
      },
    });

    await userModel.findByIdAndUpdate(loggedInUserId, {
      $pull: {
        pendingFriends: targetUserId,
      },
    });

    const user = await userModel.findById(loggedInUserId, {
      password: 0,
    });

    res.status(201).json({
      success: true,
      message: "Friend Request Cancelled",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Canceling Friend Request.",
      error,
    });
  }
};

export const removeFriend = async (
  req: Request,
  res: Response
): Promise<any> => {
  const loggedInUserId = req.user.id;
  const targetUserId = req.body.friendId;

  try {
    await userModel.findByIdAndUpdate(loggedInUserId, {
      $pull: { friends: targetUserId },
    });

    await userModel.findByIdAndUpdate(targetUserId, {
      $pull: { friends: loggedInUserId },
    });

    const user = await userModel.findById(loggedInUserId, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    res.status(201).json({
      success: true,
      message: "User Removed Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error Removing friend.",
      error,
    });
  }
};

export const confirmFriendRequest = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("airaxa hai airaxa");
  try {
    const targetUserId = req.body.friendId;
    const loggedInUserId = req.user.id;

    // Prevent adding a friend request to self
    if (loggedInUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "Cannot Add Yourself.",
      });
    }

    console.log("Airaxa");

    const update1 = await userModel.findByIdAndUpdate(loggedInUserId, {
      $pull: { friendRequests: targetUserId },
    });
    console.log("pulled from id from loggedInUser");
    console.log(update1);
    await userModel.findByIdAndUpdate(targetUserId, {
      $pull: { pendingFriends: loggedInUserId },
    });
    await userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { friends: loggedInUserId },
    });
    await userModel.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { friends: targetUserId },
    });

    const user = await userModel.findById(loggedInUserId, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    res.status(200).json({
      success: true,
      message: "Friend request confirmed successfully.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error confirming friend request.",
      error,
    });
  }
};

export const addFriend = async (req: Request, res: Response): Promise<any> => {
  try {
    const targetUserId = req.body.id;
    const loggedInUserId = req.user.id;

    // Prevent adding a friend request to self
    if (loggedInUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as a friend.",
      });
    }

    // Update the target user's friendRequests and the logged-in user's pendingFriends
    await userModel.findByIdAndUpdate(targetUserId, {
      $addToSet: { friendRequests: loggedInUserId },
    });
    await userModel.findByIdAndUpdate(loggedInUserId, {
      $addToSet: { pendingFriends: targetUserId },
    });

    const user = await userModel.findById(loggedInUserId, {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    });

    res.status(200).json({
      success: true,
      message: "Friend request sent successfully.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error sending friend request.",
      error,
    });
  }
};
