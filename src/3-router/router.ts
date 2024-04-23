import * as express from "express";
import * as path from "path";
import AuthController from "../2-controller/AuthController";
import UserController from "../2-controller/UserController";
import AuthMidleware from "../middleware/AuthMidleware";
import upload from "../middleware/UploadMiddleware";
import ThreadController from "../2-controller/ThreadController";

const router = express.Router();

//Auth
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);

// User
router.get("/findAll", UserController.findAll);
router.get("/findById/:userId", UserController.findById);
router.delete("/delete/:userId", AuthMidleware.Auth, UserController.delete);

//Thread
router.get("/findThread/:page", AuthMidleware.Auth, ThreadController.findAll);

router.use("/uploads", express.static(path.join(__dirname, "uploads")));

export default router;
