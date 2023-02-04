import mongoose from "mongoose";
const modelSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'post must be associated with a user ID'],
        ref: 'users'
    },
    projectName: {
        type: String,
        required: [true, '\'projectName\' field is mandatory! please provide it in order to create a new instance of this document type!']
    },
    data: {
        type: String,
        //required: [true, 'This field is mandatory! please provide it in order to create a new instance of this document type!']
    },
    stationType: {
        type: String,
        //required: [true, '\'StationType\' field is mandatory! please provide it in order to create a new instance of this document type!']
    },
    stationTypeName: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});
export default mongoose.model('projects', modelSchema);
