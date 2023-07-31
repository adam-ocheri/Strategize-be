import mongoose from "mongoose";

interface IUsageTracking {
    totalMinutes: number;
    totalClicks: number;
    totalRequests: number;
}

interface IDayStats {
    date: string;
    dayUsage: IUsageTracking
}

interface IGoalTracking {
    totalTasksCompletedOnTime: number;
    totalTasksCompletedOverdue: number;
    totalTasksCompletedEarly: number;
}

interface IUserStatistics {
    usageTracking: IUsageTracking;
    goalTracking: IGoalTracking;
    totalDaysSinceRegistered: number;
    calendar: IDayStats[];
}

interface IUser {
    name: string;
    email: string;
    password: string;
    userStatistics: IUserStatistics;
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
    }
}, {
    timestamps: true   
});

export default mongoose.model('users', modelSchema);