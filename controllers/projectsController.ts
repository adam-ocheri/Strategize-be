import { Request, RequestHandler, Response } from 'express';
import expressAsyncHandler from 'express-async-handler/index.js';
import mongoose from 'mongoose';
import projectModel from '../models/projectModel.js';
import { RequestVerifier, verifyRequest } from '../middleware/requestVerifier.js';
import LTGModel from '../models/LTGModel.js';
import objectiveModel from '../models/objectiveModel.js';
import taskModel from '../models/taskModel.js';

//! ROUTE: api/projects
export const getAllProjects : RequestHandler = expressAsyncHandler(async (req: Request | any, res: Response)  => { 
    const allDocs : any = await projectModel.find({owner: req.user._id}); //Get only MY projects - not the ones I am a member of
    res.json(allDocs);
});

//Create new (POST)
export const createNewProject : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.body.projectName, condition: '!req.body.projectName', value: req.body.projectName},
    ]
    verifyRequest(requirements, 'Project/Create', req, res);

    const newProject : mongoose.Document = await projectModel.create({
        projectName: req.body.projectName, 
        owner: req.user.id, 
        stationType: 'Project'}); 
    res.status(201).json(newProject);
})

//! ROUTE: api/projects/project
//Retrieve by ID (GET)
export const getProjectById : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.query.id, condition: '!req.query.id', value: req.query.id},
    ]

    verifyRequest(requirements, 'Project/GetById', req, res);

    const project : any = await projectModel.findOne({_id: req.query.id, owner: req.user._id}); //Get only MY projects - not the ones I am a member of
    console.log(project);
    res.status(200).json(project);
})

export const updateProjectById : RequestHandler = expressAsyncHandler(async (req : Request | any, res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.query.id, condition: '!req.query.id', value: req.query.id},
    ]
    verifyRequest(requirements, 'Project/UpdateById', req, res);

    console.log('req.body is:')
    console.log(req.body);

    projectModel.findByIdAndUpdate({}, {})
    const project : any = await projectModel.findOneAndUpdate({_id: req.query.id, owner: req.user._id}, req.body); 
    console.log(project);
    res.json(project);
})

export const deleteProjectById : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    const requirements : RequestVerifier[] = [
        {check: !req.query.id,                               condition: '!req.query.id',                     value: req.query.id},
        {check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id' , value: `${req.query.owner} !== ${req.user._id.toString()}`}
    ]
    verifyRequest(requirements, 'Project/DeleteById', req, res);

    //!Deleting all associated stations with this Project
    //Delete LTGs
    const LTGs : any = await LTGModel.find({owningProject: req.query.id});
    await LTGModel.deleteMany({owningProject: req.query.id});
    console.log('LTGs:')
    console.log(LTGs);

    //Delete Objectives
    for (let LTG in LTGs){
        const Objectives : any = await objectiveModel.find({owningLTG: LTGs[LTG]._id});
        
        //Delete Tasks
        for (let obj in Objectives){
            const Tasks : any = await taskModel.find({owningObjective: Objectives[obj]._id});
            console.log('Objective ID:' + Objectives[obj]._id);
            await taskModel.deleteMany({owningObjective: Objectives[obj]._id})
        }
        await objectiveModel.deleteMany({owningLTG: LTGs[LTG]._id});
        console.log('LTG ID:' + LTGs[LTG]._id);
    }

    //*Delete Project
    const project : any = await projectModel.findOneAndDelete({_id: req.query.id, owner: req.user._id}); 
    console.log(project);
    res.json(project);
})

export const getAllTasks_Project : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    console.log('TRYING TO GET ALLLLLLLLLLLLLLLLLLLLLLLLLLLL TASKSSS OF THE PROJECT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    
    const requirements : RequestVerifier[] = [
        {check: !req.query.id,                               condition: '!req.query.id',                     value: req.query.id},
        {check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id' , value: `${req.query.owner} !== ${req.user._id.toString()}`}
    ]
    verifyRequest(requirements, 'Project/GetAllTasks', req, res);

    const allTasks = [];
    
    const LTGs : any = await LTGModel.find({owningProject: req.query.id});

    //Get Objectives
    for (let LTG in LTGs){
        const Objectives : any = await objectiveModel.find({owningLTG: LTGs[LTG]._id});
        
        //Get Tasks
        for (let obj in Objectives){
            const Tasks : any = await taskModel.find({owningObjective: Objectives[obj]._id});
            allTasks.push(...Tasks);
        }
        
    }
    res.json(allTasks);
})

export const getAllProjectsAndTasks : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    console.log('TRYING TO GET ALLLLLLLLLLLLLLLLLLLLLLLLLLLL TASKSSS OF THE USER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    
    const requirements : RequestVerifier[] = [
        {check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id' , value: `${req.query.owner} !== ${req.user._id.toString()}`}
    ]
    verifyRequest(requirements, 'Project/GetAllProjectsAndTasks', req, res);

    const Projects : any = await projectModel.find({owner: req.user._id}); //Get only MY projects - not the ones I am a member of

    const allTasks = [];
    
    for (let project of Projects){
        const LTGs : any = await LTGModel.find({owningProject: project._id});

        //Get Objectives
        for (let LTG in LTGs){
            const Objectives : any = await objectiveModel.find({owningLTG: LTGs[LTG]._id});
            
            //Get Tasks
            for (let obj in Objectives){
                const Tasks : any = await taskModel.find({owningObjective: Objectives[obj]._id});
                allTasks.push(...Tasks);
            }
            
        }
    }

    res.json(allTasks);
})