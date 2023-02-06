import { Request, RequestHandler, Response } from 'express';
import expressAsyncHandler from 'express-async-handler/index.js';
import mongoose from 'mongoose';
import LTGModel from '../models/LTGModel.js';


export const getAllLTGs : RequestHandler = expressAsyncHandler(async (req: Request | any, res: Response)  => { 
    const allDocs : any = await LTGModel.find({owningProject: req.params.projectId /*or req.body.owningLTG */}); 
    console.log(allDocs);
    res.json(allDocs);
});

//Create new (POST)
export const createNewLTG : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    if (!req.body.owningProject || !req.body.owner || !req.body.LTGName) {
        res.status(400);
        console.log('fields are missing in the LTG Create request!');
        throw new Error('fields are missing in the LTG Create request!');
    }

    const newLTG : mongoose.Document = await LTGModel.create({owningProject: req.body.owningProject, owner: req.user.id, LTGName: req.body.LTGName}); 
    res.json(newLTG);
})

//Retrieve by ID (GET)
export const getLTGById : RequestHandler = expressAsyncHandler(async (req : any | Request, res : Response) => {
    if (!req.params.id){
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED')
    }

    const LTG : any = await LTGModel.findOne({
        _id: req.params.id, 
        owningProject: req.params.projectId
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    }); 
    console.log(LTG);
    res.status(200).json(LTG);
})

export const updateLTGById : RequestHandler = expressAsyncHandler(async (req : Request | any, res : Response) => {
    if (!req.params.id){
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED')
    }

    //if (LTG.owningProject.ProjectSettings.bAllowMembersChanges == false)
    if (true){ // Private
        const LTG : any = await LTGModel.findOneAndUpdate({
            _id: req.params.id, 
            owner: req.user._id, 
            owningProject: req.body.owningProject
        }, req.body); 
        console.log(LTG);
        res.json(LTG);
    } else { // Public
        const LTG : any = await LTGModel.findOneAndUpdate({
            _id: req.params.id, 
            owningProject: req.body.owningProject
            /*,memberId: req.user._id - to ensure user is a member of this station*/
        }, req.body); 
        console.log(LTG);
        res.json(LTG);
    }
    
})

export const deleteLTGById : RequestHandler = expressAsyncHandler(async (req : Request | any , res : Response) => {
    //if (req.user._id !== project.id) // For Admin mode
    const LTG : any = await LTGModel.findOneAndDelete({
        _id: req.params.id, 
        owner: req.user._id
    }); 
    console.log(LTG);
    res.json(LTG);
})