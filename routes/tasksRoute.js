import express from 'express';
import { getAllTasks, createNewTask, getTaskById, updateTaskById, deleteTaskById } from '../controllers/tasksController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
//router.route("/all/:owningObjective")
router.route("/")
    .get(protectRoute, getAllTasks)
    .post(protectRoute, createNewTask);
router.route("/task")
    .get(protectRoute, getTaskById)
    //router.route("/:id")
    .put(protectRoute, updateTaskById)
    .delete(protectRoute, deleteTaskById);
export default router;
