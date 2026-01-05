import { Router } from "express";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../Controllers/User/User.Controllers.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);

export default router;
