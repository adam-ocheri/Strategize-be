import expressAsyncHandler from '../../node_modules/express-async-handler/index.js';
import projectModel from '../models/projectModel.js';
export const getAllProjects = expressAsyncHandler(async (req, res) => {
    const allDocs = await projectModel.find({ owner: req.user.id }); //! Should it be 'req.user._id' ???
    console.log(allDocs);
    res.json(allDocs);
});
//Create new (POST)
export const createNewProject = expressAsyncHandler(async (req, res) => {
    if (!req.body.projectName) {
        res.status(400);
        console.log('projectName is missing in the request!');
        throw new Error('projectName is missing in the request!');
    }
    const newProject = await projectModel.create({ projectName: req.body.projectName, owner: req.user.id }); //! Should it be 'req.user._id' ???
    res.json(newProject);
});
//Retrieve by ID (GET)
export const getProjectById = expressAsyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    const project = await projectModel.findOne({ _id: req.params.id, owner: req.user._id }); //! Should it be 'req.user.id' ???
    console.log(project);
    res.status(200).json(project);
});
export const updateProjectById = expressAsyncHandler(async (req, res) => {
    if (!req.params.id) {
        res.status(400);
        throw new Error('Can not retrieve document! request FAILED');
    }
    const project = await projectModel.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body); //! Should it be 'req.user.id' ???
    console.log(project);
    res.json(project);
});
export const deleteProjectById = expressAsyncHandler(async (req, res) => {
    const project = await projectModel.findOneAndDelete({ _id: req.params.id, owner: req.user._id }); //! Should it be 'req.user.id' ???
    console.log(project);
    res.json(project);
});
