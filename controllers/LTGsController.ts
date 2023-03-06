import { Request, RequestHandler, Response } from 'express';
import expressAsyncHandler from 'express-async-handler/index.js';
import mongoose from 'mongoose';
import LTGModel from '../models/LTGModel.js';
import { RequestVerifier, verifyRequest } from '../middleware/requestVerifier.js';
import objectiveModel from '../models/objectiveModel.js';
import taskModel from '../models/taskModel.js';


export const getAllLTGs : RequestHandler = expressAsyncHandler(async (req: Request | any, res: Response)  => { 
    const requirements : RequestVerifier[] = [
        {check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject}
    ]
    verifyRequest(requirements, 'LTG/GetAll', req, res);

    const allDocs : any = await LTGModel.find({owningProject: req.query.owningProject}); 
    console.log(allDocs);
    res.json(allDocs);
});

//Create new (POST)
export const createNewLTG : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.body.LTGName,                           condition: '!req.body.LTGName',                 value: req.body.LTGName}, 
        {check: !req.query.owningProject ,                   condition: '!req.query.owningProject' ,         value: req.query.owningProject}, 
        {check: !req.query.owner,                            condition: '!req.query.owner' ,                 value: req.query.owner} , 
        {check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id' , value: `${req.query.owner} !== ${req.user._id.toString()}`} 
    ];
    verifyRequest(requirements, 'LTG/Create', req, res );

    const newLTG : mongoose.Document = await LTGModel.create({
        owningProject: req.query.owningProject, 
        owner: req.user._id, 
        LTGName: req.body.LTGName, 
        stationType: 'Long Term Goal'}); 
    res.status(201).json(newLTG);
})

//Retrieve by ID (GET)
export const getLTGById : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.query.id, condition: '!req.query.id', value: req.query.id},
        {check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject},
    ]
    verifyRequest( requirements , 'LTG/GetById', req, res);

    const LTG : any = await LTGModel.findOne({
        _id: req.query.id, 
        owningProject: req.query.owningProject
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    }); 
    console.log(LTG);
    res.status(200).json(LTG);
})

export const updateLTGById : RequestHandler = expressAsyncHandler(async (req : Request | any, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.query.id,              condition: '!req.query.id',            value: req.query.id},
        {check: !req.query.owningProject,   condition: '!req.query.owningProject', value: req.query.owningProject},
    ]
    verifyRequest( requirements , 'LTG/UpdateById', req, res);

    //if (LTG.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true){ // Private
        const LTG : any = await LTGModel.findOneAndUpdate({
            _id: req.query.id, 
            owner: req.user._id,
            owningProject: req.query.owningProject
        }, req.body); 
        console.log(LTG);
        res.json(LTG);
    } else { // Public
        const LTG : any = await LTGModel.findOneAndUpdate({
            _id: req.query.id, 
            owningProject: req.query.owningProject
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body); 
        console.log(LTG);
        res.json(LTG);
    }
    
})

export const deleteLTGById : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    //if (req.user._id === project.owner) // For Admin mode
    const requirements : RequestVerifier[] = [
        {check: !req.query.id, condition: '!req.query.id', value: req.query.id},
        {check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject},
        {check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id' , value: `${req.query.owner} !== ${req.user._id.toString()}`} 
    ]
    verifyRequest(requirements, 'LTG/DeleteById', req, res);

    //!Delete all substations associated with this LTG
    //Delete Objectives
    const Objectives : any = await objectiveModel.find({owningLTG: req.query.id});
    //Delete Tasks
    for (let obj in Objectives){
        const Tasks : any = await taskModel.find({owningObjective: Objectives[obj]._id});
        console.log('Objective ID:' + Objectives[obj]._id);
        await taskModel.deleteMany({owningObjective: Objectives[obj]._id})
    }
    await objectiveModel.deleteMany({owningLTG: req.query.id});
    console.log('LTG ID:' + req.query.id);

    //*Delete LTG
    const LTG : any = await LTGModel.findOneAndDelete({
        _id: req.query.id, 
        owningProject: req.query.owningProject,
        owner: req.user._id
    }); 
    console.log(LTG);
    res.json(LTG);
})

export const getAllTasks_LTG : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    //if (req.user._id === project.owner) // For Admin mode
    
    const requirements : RequestVerifier[] = [
        {check: !req.query.id, condition: '!req.query.id', value: req.query.id},
        {check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject},
        {check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id' , value: `${req.query.owner} !== ${req.user._id.toString()}`} 
    ]
    verifyRequest(requirements, 'LTG/GetAllTasks', req, res);

    const Objectives : any = await objectiveModel.find({owningLTG: req.query.id});
    const allTasks = [];

    for (let obj in Objectives){
        const Tasks : any = await taskModel.find({owningObjective: Objectives[obj]._id});
        allTasks.push(...Tasks)
        console.log('Objective ID:' + Objectives[obj]._id);
    }

    res.json(allTasks);
})