import expressAsyncHandler from 'express-async-handler/index.js';
import projectModel from '../models/projectModel.js';
import { verifyRequest } from '../middleware/requestVerifier.js';
import LTGModel from '../models/LTGModel.js';
import objectiveModel from '../models/objectiveModel.js';
import taskModel from '../models/taskModel.js';
//! ROUTE: api/projects
export const getAllProjects = expressAsyncHandler(async (req, res) => {
    const allDocs = await projectModel.find({ owner: req.user._id }); //Get only MY projects - not the ones I am a member of
    res.json(allDocs);
});
//Create new (POST)
export const createNewProject = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.body.projectName, condition: '!req.body.projectName', value: req.body.projectName },
    ];
    verifyRequest(requirements, 'Project/Create', req, res);
    const newProject = await projectModel.create({
        projectName: req.body.projectName,
        owner: req.user.id,
        stationType: 'Project'
    });
    res.status(201).json(newProject);
});
//! ROUTE: api/projects/project
//Retrieve by ID (GET)
export const getProjectById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
    ];
    verifyRequest(requirements, 'Project/GetById', req, res);
    const project = await projectModel.findOne({ _id: req.query.id, owner: req.user._id }); //Get only MY projects - not the ones I am a member of
    console.log(project);
    res.status(200).json(project);
});
export const updateProjectById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
    ];
    verifyRequest(requirements, 'Project/UpdateById', req, res);
    console.log('req.body is:');
    console.log(req.body);
    projectModel.findByIdAndUpdate({}, {});
    const project = await projectModel.findOneAndUpdate({ _id: req.query.id, owner: req.user._id }, req.body);
    console.log(project);
    res.json(project);
});
export const deleteProjectById = expressAsyncHandler(async (req, res) => {
    const requirements = [
        { check: !req.query.id, condition: '!req.query.id', value: req.query.id },
        { check: req.query.owner !== req.user._id.toString(), condition: 'req.query.owner !== req.user._id', value: `${req.query.owner} !== ${req.user._id.toString()}` }
    ];
    verifyRequest(requirements, 'Project/DeleteById', req, res);
    //!Deleting all associated stations with this Project
    //Delete LTGs
    const LTGs = await LTGModel.find({ owningProject: req.query.id });
    await LTGModel.deleteMany({ owningProject: req.query.id });
    console.log('LTGs:');
    console.log(LTGs);
    //Delete Objectives
    for (let LTG in LTGs) {
        const Objectives = await objectiveModel.find({ owningLTG: LTGs[LTG]._id });
        //Delete Tasks
        for (let obj in Objectives) {
            const Tasks = await taskModel.find({ owningObjective: Objectives[obj]._id });
            console.log('Objective ID:' + Objectives[obj]._id);
            await taskModel.deleteMany({ owningObjective: Objectives[obj]._id });
        }
        await objectiveModel.deleteMany({ owningLTG: LTGs[LTG]._id });
        console.log('LTG ID:' + LTGs[LTG]._id);
    }
    //*Delete Project
    const project = await projectModel.findOneAndDelete({ _id: req.query.id, owner: req.user._id });
    console.log(project);
    res.json(project);
});
