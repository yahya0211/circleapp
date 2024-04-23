import * as express from "express";
import * as path from "path";
import AuthController from "../2-controller/AuthController";
import UserController from "../2-controller/UserController";
import AuthMidleware from "../middleware/AuthMidleware";
import upload from "../middleware/UploadMiddleware";
import ThreadController from "../2-controller/ThreadController";
import FollowController from "../2-controller/FollowController";
import LikeController from "../2-controller/LikeController";
import ReplyController from "../2-controller/ReplyController";

const router = express.Router();

//Auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

//Follow
router.post("/follow/:followingId", FollowController.follow);

//Like
router.post("/thread/:threadId/like", LikeController.like);

//Reply
router.post("/addReply/:threadId/reply", AuthMidleware.Auth, upload.single("image"), ReplyController.addReply);
router.post("/updateReply/:threadId/reply/:replyId", AuthMidleware.Auth, upload.single("image"), ReplyController.updateReply);
router.delete("/deleteReply/:replyId", AuthMidleware.Auth, upload.single("image"), ReplyController.deleteReply);

// User
router.get("/findUser", AuthMidleware.Auth, UserController.findAll);
router.get("/findByUserId/:userId", AuthMidleware.Auth, UserController.findById);
router.get("/findByUserName/:name", AuthMidleware.Auth, UserController.findByName);
router.get("/userProfileNoImage/:userId", AuthMidleware.Auth, UserController.updateWithoutImage);
router.get("/userProfileImage/:userId", AuthMidleware.Auth, UserController.uploadProfilePicture);
router.delete("/deleteUser/:userId", AuthMidleware.Auth, UserController.delete);

//Thread
router.get("/findAllThread/:page", AuthMidleware.Auth, ThreadController.findAll);
router.get("/findThreadById/:page", AuthMidleware.Auth, ThreadController.findById);
router.post("/addThread/:threadId", AuthMidleware.Auth, upload.single("image"), ThreadController.addThread);
router.post("/updateThread/:threadId", AuthMidleware.Auth, upload.single("image"), ThreadController.updateThread);
router.delete("/deleteThread/:threadId", AuthMidleware.Auth, upload.single("image"), ThreadController.deleteThread);

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default router;
