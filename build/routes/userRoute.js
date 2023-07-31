import express from 'express';
<<<<<<< HEAD
import { createNewUser, loginExistingUser, getCurrentUser, getUserById, getAllUsers_DEV, updateUserById, deleteUserById, updateStat } from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route("/")
    .get(getAllUsers_DEV);
=======
import { createNewUser, loginExistingUser, getCurrentUser, getUserById, getter, updateUserById, deleteUserById } from '../controllers/userController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route("/")
    .get(getter);
>>>>>>> 34cd290b2cb664c0ddc7bddf89489e251a44b32b
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
<<<<<<< HEAD
//-----------------------------------------------------
router.route("/stats")
    .patch(protectRoute, updateStat);
=======
>>>>>>> 34cd290b2cb664c0ddc7bddf89489e251a44b32b
//TODO: authentication and associate User with Projects
export default router;
