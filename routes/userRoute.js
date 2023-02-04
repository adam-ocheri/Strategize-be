import express from 'express';
import { createNewUser, loginExistingUser, getCurrentUser, getUserById, getter, updateUserById, deleteUserById } from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route("/")
    .get(getter);
//-----------------------------------------------------
router.route("/register")
    .post(createNewUser);
router.route("/login")
    .post(loginExistingUser);
router.route("/current-user")
    .get(protectRoute, getCurrentUser);
//-----------------------------------------------------
router.route("/:id")
    .get(getUserById)
    .put(updateUserById)
    .delete(deleteUserById);
//TODO: authentication and associate User with Projects
export default router;
