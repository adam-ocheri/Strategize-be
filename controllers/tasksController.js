import expressAsyncHandler from 'express-async-handler/index.js';
import taskModel from '../models/taskModel.js';
import { verifyRequest } from '../middleware/requestVerifier.js';
import objectiveModel from '../models/objectiveModel.js';
import LTGModel from '../models/LTGModel.js';
import projectModel from '../models/projectModel.js';
export const getAllTasks = expressAsyncHandler(async (req, res) => {
    //!If Private?
    //* const allDocs : any = await taskModel.find({owner: req.user.id}); 
    //* console.log(allDocs);
    //* res.json(allDocs);
    const requirements = [
        { check: !req.query.owningObjective, condition: '!req.query.owningObjective', value: req.query.owningObjective },
    ];
    verifyRequest(requirements, 'Task/GetAll', req, res);
    const allDocs = await taskModel.find({
        owningObjective: req.query.owningObjective /*or req.body.owningObjective */
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(allDocs);
    res.json(allDocs);
});
//Create new (POST)
export const createNewTask = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.body.taskName, condition: '!req.body.taskName', value: req.body.taskName },
        { check: !req.query.owningObjective, condition: '!req.query.owningObjective', value: req.query.owningObjective },
        { check: !req.query.owner, condition: '!req.query.owner', value: req.query.owner },
        { check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id', value: `${req.query.owner} !== ${req.user._id.toString()}` }
    ];
    verifyRequest(requirements, 'Task/Create', req, res);
    const objective = await objectiveModel.findById(req.query.owningObjective);
    const LTG = await LTGModel.findById(objective.owningLTG);
    const project = await projectModel.findById(LTG.owningProject);
    const stationTypeName = (objective?.defaults?.taskStation_TypeName == "Task" ?
        (LTG?.defaults?.taskStation_TypeName == "Task" ? project?.defaults?.taskStation_TypeName : LTG?.defaults?.taskStation_TypeName) :
        objective?.defaults?.taskStation_TypeName);
    const newTask = await taskModel.create({
        owningObjective: req.query.owningObjective,
        owner: req.user._id,
        taskName: req.body.taskName,
        heritage: req.body.heritage,
        date: req.body.date,
        endTime: req.body.date,
        stationType: 'Task',
        iteration: 0,
        HISTORY_TaskIterations: [],
        goalAchieved: false,
        stationTypeName
    });
    res.json(newTask);
});
//Retrieve by ID (GET)
export const getTaskById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningObjective, condition: '!req.query.owningObjective', value: req.query.owningObjective },
    ];
    verifyRequest(requirements, 'Task/GetById', req, res);
    const task = await taskModel.findOne({
        _id: req.query.id,
        owningObjective: req.query.owningObjective
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(task);
    res.status(200).json(task);
});
export const updateTaskById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningObjective, condition: '!req.query.owningObjective', value: req.query.owningObjective },
    ];
    verifyRequest(requirements, 'Task/UpdateById', req, res);
    //if (Objective.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true) { // Private
        // Update Task
        const task = await taskModel.findOneAndUpdate({
            _id: req.query.id,
            owner: req.user._id,
            owningObjective: req.query.owningObjective
        }, req.body);
        console.log('BE LOG: Updating Task');
        console.log('body', req.body);
        console.log(task);
        // Return Updated Task
        const Task = await taskModel.findOne({
            _id: req.query.id,
            owner: req.user._id,
            owningObjective: req.query.owningObjective
        });
        console.log('Task Updated');
        console.log(Task);
        res.json(Task);
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
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningObjective, condition: '!req.query.owningObjective', value: req.query.owningObjective },
        { check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id', value: `${req.query.owner} !== ${req.user._id.toString()}` }
    ];
    verifyRequest(requirements, 'Task/DeleteById', req, res);
    const task = await taskModel.findOneAndDelete({
        _id: req.query.id,
        owningObjective: req.query.owningObjective,
        owner: req.user._id
    });
    console.log(task);
    res.json(task);
});
