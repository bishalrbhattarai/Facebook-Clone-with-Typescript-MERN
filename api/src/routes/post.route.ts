import { Router } from "express";
import {
  addComment,
  createPost,
  getPosts,
  likePost,
} from "../controllers/post.controller";
import { auth } from "../middleware/auth";
import { upload } from "../middleware/multer";

const router = Router();

router.post("/create-post", auth, upload.array("images"), createPost);
router.get("/posts", auth, getPosts);
router.post("/add-comment", auth, addComment);
router.post("/like", auth, likePost);

export default router;
