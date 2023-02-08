import expressAsyncHandler from 'express-async-handler/index.js';
import objectiveModel from '../models/objectiveModel.js';
export const getAllObjectives = expressAsyncHandler(async (req, res) => {
    //!If Private?
    //* const allDocs : any = await objectiveModel.find({owner: req.user.id}); 
    //* console.log(allDocs);
    //* res.json(allDocs);
    const allDocs = await objectiveModel.find({
        owningLTG: req.query.owningLTG /*or req.body.owningLTG */
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(allDocs);
    res.json(allDocs);
});
//Create new (POST)
export const createNewObjective = expressAsyncHandler(async (req, res) => {
    if (!req.body.objectiveName || !req.query.owningLTG || !req.query.owner || req.query.owner !== req.user.id) {
        res.status(400);
        console.log('fields are missing in the Objective Create request!');
        throw new Error('fields are missing in the Objective Create request!');
    }
    const newObjective = await objectiveModel.create({
        owningLTG: req.query.owningLTG,
        owner: req.user.id,
        objectiveName: req.body.objectiveName
    });
    res.json(newObjective);
});
//Retrieve by ID (GET)
export const getObjectiveById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id || !req.query.owningLTG) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    const objective = await objectiveModel.findOne({
        _id: req.query.id,
        owningLTG: req.query.owningLTG
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(objective);
    res.status(200).json(objective);
});
export const updateObjectiveById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    //if (LTG.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true) { // Private
        const objective = await objectiveModel.findOneAndUpdate({
            _id: req.query.id,
            owner: req.user._id,
            owningLTG: req.query.owningLTG
        }, req.body);
        console.log(objective);
        res.json(objective);
    }
    else { // Public
        const objective = await objectiveModel.findOneAndUpdate({
            _id: req.query.id,
            owningProject: req.query.owningProject
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body);
        console.log(objective);
        res.json(objective);
    }
});
export const deleteObjectiveById = expressAsyncHandler(async (req, res) => {
    const objective = await objectiveModel.findOneAndDelete({
        _id: req.query.id,
        owner: req.user._id
    });
    console.log(objective);
    res.json(objective);
});
