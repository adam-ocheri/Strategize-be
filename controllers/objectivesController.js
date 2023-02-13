import expressAsyncHandler from 'express-async-handler/index.js';
import objectiveModel from '../models/objectiveModel.js';
import { verifyRequest } from '../middleware/requestVerifier.js';
import taskModel from '../models/taskModel.js';
export const getAllObjectives = expressAsyncHandler(async (req, res) => {
    //!If Private?
    //* const allDocs : any = await objectiveModel.find({owner: req.user.id}); 
    //* console.log(allDocs);
    //* res.json(allDocs);
    const requirements = [
        { check: !req.query.owningLTG, condition: '!req.query.owningLTG', value: req.query.owningLTG },
    ];
    verifyRequest(requirements, 'Objective/GetAll', req, res);
    const allDocs = await objectiveModel.find({
        owningLTG: req.query.owningLTG /*or req.body.owningLTG */
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(allDocs);
    res.json(allDocs);
});
//Create new (POST)
export const createNewObjective = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.body.objectiveName, condition: '!req.body.objectiveName', value: req.body.objectiveName },
        { check: !req.query.owningLTG, condition: '!req.query.owningLTG', value: req.query.owningLTG },
        { check: !req.query.owner, condition: '!req.query.owner', value: req.query.owner },
        { check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id', value: `${req.query.owner} !== ${req.user._id.toString()}` }
    ];
    verifyRequest(requirements, 'Objective/Create', req, res);
    const newObjective = await objectiveModel.create({
        owningLTG: req.query.owningLTG,
        owner: req.user.id,
        objectiveName: req.body.objectiveName,
        stationType: 'Objective'
    });
    res.status(201).json(newObjective);
});
//Retrieve by ID (GET)
export const getObjectiveById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningLTG, condition: '!req.query.owningLTG', value: req.query.owningLTG },
    ];
    verifyRequest(requirements, 'Objective/GetById', req, res);
    const objective = await objectiveModel.findOne({
        _id: req.query.id,
        owningLTG: req.query.owningLTG
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(objective);
    res.status(200).json(objective);
});
export const updateObjectiveById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningLTG, condition: '!req.query.owningLTG', value: req.query.owningLTG },
    ];
    verifyRequest(requirements, 'Objective/UpdateById', req, res);
    //if (LTG.owningLTG.ProjectSettings.bAllowMembersChanges == false)
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
            owningLTG: req.query.owningLTG
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body);
        console.log(objective);
        res.json(objective);
    }
});
export const deleteObjectiveById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningLTG, condition: '!req.query.owningLTG', value: req.query.owningLTG },
        { check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id', value: `${req.query.owner} !== ${req.user._id.toString()}` }
    ];
    verifyRequest(requirements, 'Objective/GetById', req, res);
    //!Delete all sub-stations associated with this Objective!
    //Delete Tasks
    const Tasks = await taskModel.find({ owningObjective: req.query.id });
    console.log('Objective ID:' + req.query.id);
    await taskModel.deleteMany({ owningObjective: req.query.id });
    //*Delete Objective
    const objective = await objectiveModel.findOneAndDelete({
        _id: req.query.id,
        owner: req.user._id
    });
    console.log(objective);
    res.json(objective);
});
