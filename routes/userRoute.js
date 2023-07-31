import express from 'express';
import { createNewUser, loginExistingUser, getCurrentUser, getUserById, getAllUsers_DEV, updateUserById, deleteUserById, updateStat } from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route("/")
    .get(getAllUsers_DEV);
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
//-----------------------------------------------------
router.route("/stats")
    .patch(protectRoute, updateStat);
//TODO: authentication and associate User with Projects
export default router;
