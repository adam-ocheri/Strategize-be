import mongoose from "mongoose";

export interface IUsageTracking {
    totalMinutes: number;
    totalClicks: number;
    totalRequests: number;
}

export interface IDayStats {
    date: string;
    dayUsage: IUsageTracking
    goalTracking: IGoalTracking;
}

export interface IGoalTracking {
    totalTasksCompletedOnTime: number;
    totalTasksCompletedOverdue: number;
    totalTasksCompletedEarly: number;
}

export interface IUserStatistics {
    usageTracking: IUsageTracking;
    goalTracking: IGoalTracking;
    totalDaysSinceRegistered: number;
    calendar: IDayStats[];
}

interface IUser {
    name: string;
    email: string;
    password: string;
    userStatistics: {};
}

const modelSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is mandatory']
    },
    userStatistics : {
        type: Object,
        required: [true, 'Must have user statistics initialized!']
    }
}, {
    timestamps: true   
});

export default mongoose.model('users', modelSchema);