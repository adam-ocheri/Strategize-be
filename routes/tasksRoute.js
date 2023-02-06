import express from 'express';
import { getAllTasks, createNewTask, getTaskById, updateTaskById, deleteTaskById } from '../controllers/tasksController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route("/all/:objectiveId")
    .get(protectRoute, getAllTasks);
router.route("/")
    .post(protectRoute, createNewTask);
router.route("/:id")
    .get(protectRoute, getTaskById)
    .put(protectRoute, updateTaskById)
    .delete(protectRoute, deleteTaskById);
export default router;
