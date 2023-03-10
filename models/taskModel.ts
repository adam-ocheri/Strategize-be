import mongoose from "mongoose";


interface ITask {
    //TODO : Should conceive these functions elsewhere
    //*GetSelfRole() : string ['Admin' | 'Member']

    owner: mongoose.Schema.Types.ObjectId;
    stationType : 'Task';
    stationTypeName : string,
    owningObjective : mongoose.Schema.Types.ObjectId,
    taskName : string,
    members : mongoose.Schema.Types.ObjectId[],
    date: string,
    currentlyActive  : boolean,
    objectiveCalendar : Date,
    description : string,
    Notes : string[],
    iteration : number,
    HISTORY_TaskIterations : []
}

const modelSchema = new mongoose.Schema<ITask>({
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
    iteration :{
        type: Number
    },
    HISTORY_TaskIterations : {
        type: []
    }
}, {
    timestamps: true   
});

export default mongoose.model('tasks', modelSchema);