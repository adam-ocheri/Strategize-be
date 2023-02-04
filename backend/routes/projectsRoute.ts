import express from 'express';
import { getAllProjects, createNewProject, getProjectById, updateProjectById, deleteProjectById } from '../controllers/projectsController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router : express.Router = express.Router();

router.route("/")
.get(protectRoute, getAllProjects)
.post(protectRoute, createNewProject)

router.route("/:id")
.get(protectRoute, getProjectById)
.put(protectRoute, updateProjectById)
.delete(protectRoute, deleteProjectById)

export default router;