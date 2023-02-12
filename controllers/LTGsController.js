import expressAsyncHandler from 'express-async-handler/index.js';
import LTGModel from '../models/LTGModel.js';
import { verifyRequest } from '../middleware/requestVerifier.js';
export const getAllLTGs = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject }
    ];
    verifyRequest(requirements, 'LTG/GetAll', req, res);
    const allDocs = await LTGModel.find({ owningProject: req.query.owningProject });
    console.log(allDocs);
    res.json(allDocs);
});
//Create new (POST)
export const createNewLTG = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.body.LTGName, condition: '!req.body.LTGName', value: req.body.LTGName },
        { check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject },
        { check: !req.query.owner, condition: '!req.query.owner', value: req.query.owner },
        { check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id', value: `${req.query.owner} !== ${req.user._id.toString()}` }
    ];
    verifyRequest(requirements, 'LTG/Create', req, res);
    const newLTG = await LTGModel.create({ owningProject: req.query.owningProject, owner: req.user._id, LTGName: req.body.LTGName });
    res.status(201).json(newLTG);
});
//Retrieve by ID (GET)
export const getLTGById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject },
    ];
    verifyRequest(requirements, 'LTG/GetById', req, res);
    const LTG = await LTGModel.findOne({
        _id: req.query.id,
        owningProject: req.query.owningProject
        /*,memberId: req.user._id - to ensure user is a member of this station*/
    });
    console.log(LTG);
    res.status(200).json(LTG);
});
export const updateLTGById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject },
    ];
    verifyRequest(requirements, 'LTG/UpdateById', req, res);
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
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: !req.query.owningProject, condition: '!req.query.owningProject', value: req.query.owningProject },
        { check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id', value: `${req.query.owner} !== ${req.user._id.toString()}` }
    ];
    verifyRequest(requirements, 'LTG/DeleteById', req, res);
    const LTG = await LTGModel.findOneAndDelete({
        _id: req.query.id,
        owningProject: req.query.owningProject,
        owner: req.user._id
    });
    console.log(LTG);
    res.json(LTG);
});
