import { Request, RequestHandler, Response } from 'express';
import expressAsyncHandler from 'express-async-handler/index.js';
import mongoose from 'mongoose';
import taskModel from '../models/taskModel.js';
import { RequestVerifier, verifyRequest } from '../middleware/requestVerifier.js';


export const getAllTasks : RequestHandler = expressAsyncHandler(async (req: Request | any, res: Response)  => { 
    //!If Private?
    //* const allDocs : any = await taskModel.find({owner: req.user.id}); 
    //* console.log(allDocs);
    //* res.json(allDocs);
    const requirements : RequestVerifier[] = [
        {check: !req.query.owningObjective, condition: '!req.query.owningObjective', value: req.query.owningObjective},
    ]
    verifyRequest(requirements, 'Task/GetAll', req, res);

    const allDocs : any = await taskModel.find({
        owningObjective: req.query.owningObjective /*or req.body.owningObjective */
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    }); 
    console.log(allDocs);
    res.json(allDocs);
});

//Create new (POST)
export const createNewTask : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.body.taskName, condition: '!req.body.taskName', value: req.body.taskName}, 
        {check: !req.query.owningObjective , condition: '!req.query.owningObjective' , value: req.query.owningObjective}, 
        {check: !req.query.owner, condition: '!req.query.owner' , value: req.query.owner} , 
        {check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id' , value: `${req.query.owner} !== ${req.user._id.toString()}`} 
    ];
    verifyRequest(requirements, 'Task/Create', req, res );

    const newTask : mongoose.Document = await taskModel.create({
        owningObjective: req.query.owningObjective, 
        owner: req.user._id,
        taskName: req.body.taskName,
        heritage: req.body.heritage,
        date: req.body.date,
        endTime: req.body.date,
        stationType: 'Task',
        iteration : 0,
        HISTORY_TaskIterations: []
    }); 
    res.json(newTask);
})

//Retrieve by ID (GET)
export const getTaskById : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.query.id, condition: '!req.query.id', value: req.query.id},
        {check: !req.query.owningObjective, condition: '!req.query.owningObjective', value: req.query.owningObjective},
    ]
    verifyRequest(requirements, 'Task/GetById', req, res );

    const task : any = await taskModel.findOne({
        _id: req.query.id, 
        owningObjective: req.query.owningObjective
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    }); 
    console.log(task);
    res.status(200).json(task);
})

export const updateTaskById : RequestHandler = expressAsyncHandler(async (req : Request | any, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.query.id, condition: '!req.query.id', value: req.query.id},
        {check: !req.query.owningObjective, condition: '!req.query.owningObjective', value: req.query.owningObjective},
    ]
    verifyRequest(requirements, 'Task/UpdateById', req, res );

    //if (Objective.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true){ // Private
        // Update Task
        const task : any = await taskModel.findOneAndUpdate({
            _id: req.query.id, 
            owner: req.user._id, 
            owningObjective: req.query.owningObjective
        }, req.body); 
        console.log('BE LOG: Updating Task');
        console.log('body', req.body)
        console.log(task);

        // Return Updated Task
        const Task : any = await taskModel.findOne({
            _id: req.query.id, 
            owner: req.user._id, 
            owningObjective: req.query.owningObjective
        }); 
        console.log('Task Updated');
        console.log(Task);
        res.json(Task);
    } else { // Public
        const task : any = await taskModel.findOneAndUpdate({
            _id: req.params.id, 
            owningProject: req.body.owningProject
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body); 
        console.log(task);
        res.json(task);
    }
    
})

export const deleteTaskById : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.query.id,                               condition: '!req.query.id',                     value: req.query.id},
        {check: !req.query.owningObjective,                  condition: '!req.query.owningObjective',        value: req.query.owningObjective},
        {check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id' , value: `${req.query.owner} !== ${req.user._id.toString()}`}
    ]
    verifyRequest(requirements, 'Task/DeleteById', req, res);

    const task : any = await taskModel.findOneAndDelete({
        _id: req.query.id,
        owningObjective: req.query.owningObjective, 
        owner: req.user._id
    }); 
    console.log(task);
    res.json(task);
})