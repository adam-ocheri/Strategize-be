import express from 'express';
import { getAllLTGs, createNewLTG, getLTGById, updateLTGById, deleteLTGById } from '../controllers/LTGsController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route("/all/:projectId")
    .get(protectRoute, getAllLTGs);
router.route("/")
    .post(protectRoute, createNewLTG);
router.route("/:id")
    .get(protectRoute, getLTGById)
    .put(protectRoute, updateLTGById)
    .delete(protectRoute, deleteLTGById);
export default router;
