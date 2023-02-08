import expressAsyncHandler from 'express-async-handler/index.js';
import taskModel from '../models/taskModel.js';
export const getAllTasks = expressAsyncHandler(async (req, res) => {
    //!If Private?
    //* const allDocs : any = await taskModel.find({owner: req.user.id}); 
    //* console.log(allDocs);
    //* res.json(allDocs);
    const allDocs = await taskModel.find({
        owningObjective: req.query.owningObjective /*or req.body.owningObjective */
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(allDocs);
    res.json(allDocs);
});
//Create new (POST)
export const createNewTask = expressAsyncHandler(async (req, res) => {
    if (!req.body.taskName || !req.query.owningObjective || !req.query.owner || req.query.owner !== req.user._id) {
        res.status(400);
        console.log('fields are missing in the Task Create request!');
        throw new Error('fields are missing in the Task Create request!');
    }
    const newTask = await taskModel.create({
        owningObjective: req.query.owningObjective,
        owner: req.user._id,
        taskName: req.body.taskName
    });
    res.json(newTask);
});
//Retrieve by ID (GET)
export const getTaskById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id || !req.query.owningObjective) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    const task = await taskModel.findOne({
        _id: req.query.id,
        owningObjective: req.query.owningObjective
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(task);
    res.status(200).json(task);
});
export const updateTaskById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id || !req.query.owningObjective) {
        res.status(400);
        throw new Error('Can not retrieve document!Please supply query params! request FAILED');
    }
    //if (Objective.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true) { // Private
        const task = await taskModel.findOneAndUpdate({
            _id: req.query.id,
            owner: req.user._id,
            owningObjective: req.query.owningObjective
        }, req.body);
        console.log(task);
        res.json(task);
    }
    else { // Public
        const task = await taskModel.findOneAndUpdate({
            _id: req.params.id,
            owningProject: req.body.owningProject
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body);
        console.log(task);
        res.json(task);
    }
});
export const deleteTaskById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id || !req.query.owningObjective) {
        res.status(400);
        throw new Error('Can not retrieve document!Please supply query params! request FAILED');
    }
    const task = await taskModel.findOneAndDelete({
        _id: req.query.id,
        owningObjective: req.query.owningObjective,
        owner: req.user._id
    });
    console.log(task);
    res.json(task);
});
