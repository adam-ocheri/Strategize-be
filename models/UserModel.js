import mongoose from "mongoose";
const modelSchema = new mongoose.Schema({
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
    userStatistics: {
        type: Object,
        required: [true, 'Must have user statistics initialized!']
    }
}, {
    timestamps: true
});
export default mongoose.model('users', modelSchema);
