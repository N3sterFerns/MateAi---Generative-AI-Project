import {Router} from "express"
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { verifyAuth } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", 
    body('email').isEmail().withMessage("Email must be a valid email"),
    body("password").isLength({min: 6}).withMessage("Password must be strong"),
    userController.createUserController)

router.post("/login", 
    body("email").isEmail().withMessage("Invalid Email"),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    userController.loginUserController
)

router.get("/profile", verifyAuth, userController.userProfile)
router.get("/logout", verifyAuth, userController.logOut)

// router.get("/all", verifyAuth, userController.getAllUsersController)
router.get("/all/search", verifyAuth, userController.getAllUsersController)


export default router;
