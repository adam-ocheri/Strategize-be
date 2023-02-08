import express from 'express';
import { getAllObjectives, createNewObjective, getObjectiveById, updateObjectiveById, deleteObjectiveById } from '../controllers/objectivesController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router : express.Router = express.Router();

//router.route("/all/:LTGId")


router.route("/")
.get(protectRoute, getAllObjectives)
.post(protectRoute, createNewObjective);

router.route("/objective")
.get(protectRoute, getObjectiveById)
//router.route("/:id")
.put(protectRoute, updateObjectiveById)
.delete(protectRoute, deleteObjectiveById);

export default router;