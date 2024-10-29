import { Router } from "express";
import {
  getUserProfile,
  searchUserByName,
  updateAvatar,
  updateCover,
  addFriend,
} from "../controllers/user.controller";
import { auth } from "../middleware/auth";
import { upload } from "../middleware/multer";
const router = Router();

router.post("/search", auth, searchUserByName);
router.post("/", auth, getUserProfile);
router.post("/updateAvatar", auth, upload.single("avatar"), updateAvatar);
router.post("/updateCover", auth, upload.single("cover"), updateCover);
router.post("/add-friend", auth, addFriend);

export default router;
