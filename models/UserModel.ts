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

interface IHistory {
    totalDaysSinceRegistered: number;
    calendar: IDayStats[];
}

interface IUserStatistics {
    usageTracking: IUsageTracking;
    history: IHistory;
}

interface IUser {
    name: string;
    email: string;
    password: string;
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