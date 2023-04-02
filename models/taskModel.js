import mongoose from "mongoose";
const modelSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'post must be associated with a user ID'],
        ref: 'users'
    },
    owningObjective: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, '\'owningObjective\' field is mandatory! please provide it in order to create a new instance of this document type!'],
        ref: 'objectives'
    },
    taskName: {
        type: String,
        required: [true, '\'taskName\' field is mandatory! please provide it in order to create a new instance of this document type!']
    },
    currentlyActive: {
        type: Boolean,
        //required: [true, '\'currentlyActive\' field is mandatory! please provide it in order to create a new instance of this document type!']
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
    },
    date: {
        type: String
    },
    iteration: {
        type: Number
    },
    HISTORY_TaskIterations: {
        type: []
    },
    heritage: {
        type: Object
    }
}, {
    timestamps: true
});
export default mongoose.model('tasks', modelSchema);
