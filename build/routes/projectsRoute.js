import express from 'express';
import { getAllProjects, createNewProject, getProjectById, updateProjectById, deleteProjectById, getAllTasks_Project, getAllProjectsAndTasks } from '../controllers/projectsController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route("/")
    .get(protectRoute, getAllProjects)
    .post(protectRoute, createNewProject);
router.route("/project")
    .get(protectRoute, getProjectById)
    .put(protectRoute, updateProjectById)
    .delete(protectRoute, deleteProjectById);
router.route("/project/all")
    .get(protectRoute, getAllTasks_Project);
router.route("/alltasks")
    .get(protectRoute, getAllProjectsAndTasks);
export default router;
