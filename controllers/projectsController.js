import expressAsyncHandler from 'express-async-handler/index.js';
import projectModel from '../models/projectModel.js';
//! ROUTE: api/projects
export const getAllProjects = expressAsyncHandler(async (req, res) => {
    const allDocs = await projectModel.find({ owner: req.user._id });
    res.json(allDocs);
});
//Create new (POST)
export const createNewProject = expressAsyncHandler(async (req, res) => {
    if (!req.body.projectName) {
        res.status(400);
        console.log('projectName is missing in the request!');
        throw new Error('projectName is missing in the request!');
    }
    const newProject = await projectModel.create({ projectName: req.body.projectName, owner: req.user.id });
    res.json(newProject);
});
//! ROUTE: api/projects/project
//Retrieve by ID (GET)
export const getProjectById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    console.log('Logging Query.........');
    console.log(req.query.id);
    console.log(req.user._id);
    const project = await projectModel.findOne({ _id: req.query.id, owner: req.user._id });
    console.log(project);
    res.status(200).json(project);
});
export const updateProjectById = expressAsyncHandler(async (req, res) => {
    if (!req.query.id) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    const project = await projectModel.findOneAndUpdate({ _id: req.query.id, owner: req.user._id }, req.body);
    console.log(project);
    res.json(project);
});
export const deleteProjectById = expressAsyncHandler(async (req, res) => {
    const project = await projectModel.findOneAndDelete({ _id: req.query.id, owner: req.user._id });
    console.log(project);
    res.json(project);
});
