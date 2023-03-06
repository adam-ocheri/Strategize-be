import express from 'express';
import { getAllLTGs, createNewLTG, getLTGById, updateLTGById, deleteLTGById, getAllTasks_LTG } from '../controllers/LTGsController.js';
import { protectRoute } from '../middleware/authMiddleware.js';
const router = express.Router();
//router.route("/all/:projectId")
router.route("/")
    .get(protectRoute, getAllLTGs)
    .post(protectRoute, createNewLTG);
router.route("/LTG/")
    .get(protectRoute, getLTGById)
    //router.route("/:id")
    .put(protectRoute, updateLTGById)
    .delete(protectRoute, deleteLTGById);
router.route("/LTG/all")
    .get(protectRoute, getAllTasks_LTG);
export default router;
