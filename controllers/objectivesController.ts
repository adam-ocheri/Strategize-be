import { Request, RequestHandler, Response } from 'express';
import expressAsyncHandler from 'express-async-handler/index.js';
import mongoose from 'mongoose';
import objectiveModel from '../models/objectiveModel.js';


export const getAllObjectives : RequestHandler = expressAsyncHandler(async (req: Request | any, res: Response)  => { 
    //!If Private?
    //* const allDocs : any = await objectiveModel.find({owner: req.user.id}); 
    //* console.log(allDocs);
    //* res.json(allDocs);

    const allDocs : any = await objectiveModel.find({
        owningLTG: req.params.LTGId /*or req.body.owningLTG */
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    }); 
    console.log(allDocs);
    res.json(allDocs);
});

//Create new (POST)
export const createNewObjective : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    if (!req.body.owningLTG || !req.body.owner || !req.body.objectiveName) {
        res.status(400);
        console.log('fields are missing in the Objective Create request!');
        throw new Error('fields are missing in the Objective Create request!');
    }

    const newObjective : mongoose.Document = await objectiveModel.create({
        owningLTG: req.body.owningLTG, 
        owner: req.user.id, 
        objectiveName: req.body.objectiveName
    }); 
    res.json(newObjective);
})

//Retrieve by ID (GET)
export const getObjectiveById : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    if (!req.params.id){
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED')
    }

    const objective : any = await objectiveModel.findOne({
        _id: req.params.id, 
        owningLTG: req.params.ltgId
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    }); 
    console.log(objective);
    res.status(200).json(objective);
})

export const updateObjectiveById : RequestHandler = expressAsyncHandler(async (req : Request | any, res : Response) => {
    if (!req.params.id){
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED')
    }

    //if (LTG.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true){ // Private
        const objective : any = await objectiveModel.findOneAndUpdate({
            _id: req.params.id, 
            owner: req.user._id, 
            owningLTG: req.body.owningLTG
        }, req.body); 
        console.log(objective);
        res.json(objective);
    } else { // Public
        const objective : any = await objectiveModel.findOneAndUpdate({
            _id: req.params.id, 
            owningProject: req.body.owningProject
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body); 
        console.log(objective);
        res.json(objective);
    }
    
})

export const deleteObjectiveById : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    const objective : any = await objectiveModel.findOneAndDelete({
        _id: req.params.id, 
        owner: req.user._id
    }); 
    console.log(objective);
    res.json(objective);
})