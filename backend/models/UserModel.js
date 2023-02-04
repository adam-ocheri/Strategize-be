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
    }
}, {
    timestamps: true
});
export default mongoose.model('users', modelSchema);
