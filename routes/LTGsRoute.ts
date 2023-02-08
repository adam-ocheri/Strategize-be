import express from 'express';
import { getAllLTGs, createNewLTG, getLTGById, updateLTGById, deleteLTGById } from '../controllers/LTGsController.js';
import { protectRoute } from '../middleware/authMiddleware.js';

const router : express.Router = express.Router();

//router.route("/all/:projectId")


router.route("/")
.get(protectRoute, getAllLTGs)
.post(protectRoute, createNewLTG);

router.route("/LTG/")
.get(protectRoute, getLTGById)
//router.route("/:id")
.put(protectRoute, updateLTGById)
.delete(protectRoute, deleteLTGById);

export default router;