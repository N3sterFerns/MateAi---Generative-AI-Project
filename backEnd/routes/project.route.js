import {Router} from "express"
import { body } from "express-validator";
import { verifyAuth } from "../middlewares/auth.middleware.js";
import * as projectController from "../controllers/project.controller.js"

const router = Router()

router.post("/create", 
    body('name').isString().withMessage("name is required"),
    verifyAuth,
    projectController.createProjectController)

router.get("/all", 
    verifyAuth,
    projectController.getAllProject)


router.put("/add-user", 
    body('projectId').isString().withMessage('Project ID is required'),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'object'
        )).withMessage('Each user must be a string'),
    verifyAuth,
    projectController.addUserToProject
)

router.get("/get-project/:projectId", verifyAuth, projectController.getProjectId)

router.get("/remove/:id", verifyAuth, projectController.removeProject)

export default router;
