import express from 'express';
import { getAllObjectives, createNewObjective, getObjectiveById, updateObjectiveById, deleteObjectiveById } from '../controllers/objectivesController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route("/all/:LTGId")
    .get(protectRoute, getAllObjectives);
router.route("/")
    .post(protectRoute, createNewObjective);
router.route("/:id")
    .get(protectRoute, getObjectiveById)
    .put(protectRoute, updateObjectiveById)
    .delete(protectRoute, deleteObjectiveById);
export default router;
