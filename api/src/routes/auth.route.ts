import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.get("/", auth, (req, res) => {
  console.log("the payload in the main route is");
  console.log(req.user);
  res.json("got the data");
});

router.post("/signup", signUp);
router.post("/login", login);

export default router;
