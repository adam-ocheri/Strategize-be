import expressAsyncHandler from 'express-async-handler/index.js';
import userModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import JsonWebToken from 'jsonwebtoken';
//*For Development only:
export const getAllUsers_DEV = expressAsyncHandler(async (req, res) => {
    const allDocs = await userModel.find();
    res.json(allDocs);
});
//!---------------------------------------------------------------------------------------------------------------------------------------------------------------
//Create new (POST)
export const createNewUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    //validations
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("must specify all fields to register as a new user!");
    }
    const userExists = await userModel.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists!');
    }
    //encrypt the user's password
    const hashSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, hashSalt);
    const userStatistics = {
        usageTracking: {
            totalMinutes: 0,
            totalClicks: 0,
            totalRequests: 0
        },
        goalTracking: {
            totalTasksCompletedOnTime: 0,
            totalTasksCompletedOverdue: 0,
            totalTasksCompletedEarly: 0
        },
        totalDaysSinceRegistered: 0,
        calendar: [{
                date: new Date().toString().slice(0, 15),
                dayUsage: {
                    totalMinutes: 0,
                    totalClicks: 0,
                    totalRequests: 0
                },
                goalTracking: {
                    totalTasksCompletedOnTime: 0,
                    totalTasksCompletedOverdue: 0,
                    totalTasksCompletedEarly: 0
                },
            }]
    };
    const newUser = await userModel.create({
        name: name,
        email: email,
        password: hashedPassword,
        userStatistics: userStatistics
    });
    if (newUser) {
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            userStatistics: newUser.userStatistics,
            token: generateToken(newUser._id)
        });
    }
    else {
        res.status(400);
        throw new Error('user creation failed!');
    }
});
//login to account (POST)
export const loginExistingUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
        if (await bcrypt.compare(password, user.password)) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                userStatistics: user.userStatistics,
                token: generateToken(user._id)
            });
        }
        else {
            res.status(400);
            throw new Error('wrong password!');
        }
    }
    else {
        res.status(400);
        throw new Error('Invalid user email address');
    }
});
export const getCurrentUser = expressAsyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});
//!---------------------------------------------------------------------------------------------------------------------------------------------------------------
//Retrieve by ID (GET)
export const getUserById = expressAsyncHandler(async (req, res) => {
    const doc = await userModel.findById({ _id: req.params.id });
    console.log(doc);
    res.json(doc);
});
//Update by ID (PUT)
export const updateUserById = expressAsyncHandler(async (req, res) => {
    const doc = await userModel.findByIdAndUpdate({ _id: req.params.id }, req.body);
    console.log(doc);
    res.json(doc);
});
//Delete by ID (DELETE)
export const deleteUserById = expressAsyncHandler(async (req, res) => {
    const Doc = await userModel.findByIdAndDelete({ _id: req.params.id });
    console.log(Doc);
    res.json(Doc);
});
//!------------------------------------------------------------------------------------------------------------------------------------------------------------------
const generateToken = (id) => {
    return JsonWebToken.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
//!-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//!------------------------------------------------------------------------------------------------------------------------------------------------------------------
//!------------------------------------------------------------------------------------------------------------------------------------------------------------------
export const updateStat = expressAsyncHandler(async (req, res) => {
    console.log('Stats Route is working!');
    console.log(req.body);
    const userId = req.query.id;
    const user = await userModel.findById({ _id: req.query.id });
    // res.json(user);
    console.log(user);
    console.log('user:');
    if (user) {
        console.log('user IS VALID!!!!!');
        const { stat, targetValue } = req.body;
        let statString = `userStatistics.${stat}.${targetValue}`;
        let doc = {};
        if (stat == 'usageTracking' || stat == 'goalTracking') {
            console.log('STATS! :', { stat, targetValue });
            doc = await userModel.findOneAndUpdate({ _id: userId }, { $inc: { [statString]: 1 } });
            console.log(doc);
        }
        else if (stat == 'calendar') {
            const todayDate = new Date().toString().slice(0, 15);
            let found = false;
            let at = 0;
            for (let dayIdx = 0; dayIdx < user.userStatistics.calendar.length; ++dayIdx) {
                if (user.userStatistics.calendar[dayIdx].date == todayDate) {
                    found = true;
                    at = dayIdx;
                    break;
                }
            }
            if (found) {
                statString = `userStatistics.${stat}.${at}.${targetValue}`;
                doc = await userModel.findOneAndUpdate({ _id: userId }, { $inc: { [statString]: 1 } });
            }
            else {
                const newCalendarDay = {
                    date: new Date().toString().slice(0, 15),
                    dayUsage: {
                        totalMinutes: 1,
                        totalClicks: 0,
                        totalRequests: 0
                    }
                };
                doc = await userModel.findOneAndUpdate({ _id: userId }, { $push: { 'userStatistics.calendar': newCalendarDay } }, { new: true });
            }
        }
        else if (stat == 'totalDaysSinceRegistered') {
            // TODO - How can days be counted if there may be days where the user would not log in at all
        }
        const updatedUser = await userModel.findById(req.params.id);
        res.status(200).json({
            userStatistics: updatedUser.userStatistics,
        });
        //res.status(200).json(updatedUser)
    }
    else {
        res.status(400);
        throw new Error('Invalid user data - user was not found');
    }
});
export const GetStat = expressAsyncHandler(async (req, res) => {
    // const {email, password} = req.body;
    const user = await userModel.findById({ _id: req.params.id });
    if (user) {
        const doc = await userModel.findOne({ $where: `this._id == ${req.params.id}` }, req.body);
        res.status(200).json(doc);
    }
    else {
        res.status(400);
        throw new Error('Invalid user data - user was not found');
    }
});
