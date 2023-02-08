import expressAsyncHandler from 'express-async-handler/index.js';
import LTGModel from '../models/LTGModel.js';
export const getAllLTGs = expressAsyncHandler(async (req, res) => {
    const allDocs = await LTGModel.find({ owningProject: req.query.owningProject /*or req.body.owningLTG */ });
    console.log(allDocs);
    res.json(allDocs);
});
//Create new (POST)
export const createNewLTG = expressAsyncHandler(async (req, res) => {
    if (!req.body.LTGName || !req.query.owningProject || !req.query.owner || !req.query.owner !== req.user._id) {
        res.status(400);
        console.log('fields are missing in the LTG Create request!');
        throw new Error('fields are missing in the LTG Create request!');
    }
    const newLTG = await LTGModel.create({ owningProject: req.query.owningProject, owner: req.user._id, LTGName: req.body.LTGName });
    res.json(newLTG);
});
//Retrieve by ID (GET)
export const getLTGById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id || !req.query.owningProject) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    const LTG = await LTGModel.findOne({
        _id: req.query.id,
        owningProject: req.query.owningProject
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(LTG);
    res.status(200).json(LTG);
});
export const updateLTGById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id || !req.query.owningProject) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    //if (LTG.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true) { // Private
        const LTG = await LTGModel.findOneAndUpdate({
            _id: req.query.id,
            owner: req.user._id,
            owningProject: req.query.owningProject
        }, req.body);
        console.log(LTG);
        res.json(LTG);
    }
    else { // Public
        const LTG = await LTGModel.findOneAndUpdate({
            _id: req.query.id,
            owningProject: req.query.owningProject
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body);
        console.log(LTG);
        res.json(LTG);
    }
});
export const deleteLTGById = expressAsyncHandler(async (req, res) => {
    //if (req.user._id === project.owner) // For Admin mode
    const LTG = await LTGModel.findOneAndDelete({
        _id: req.query.id,
        owner: req.user._id
    });
    console.log(LTG);
    res.json(LTG);
});
