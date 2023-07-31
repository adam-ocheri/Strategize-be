import mongoose from "mongoose";

interface IDefaults {
    taskStation_TypeName: string;
}

interface IObjective {
    //TODO : Should conceive these functions elsewhere
    //*IsTeamProject() : {return Members.length>1}
    //*GetSelfRole() : string ['Admin' | 'Member']

    //dummy data for now
    owner: mongoose.Schema.Types.ObjectId;
    data: string;

    //critical data
    stationType : 'Objective';
    stationTypeName : string,
    owningLTG : mongoose.Schema.Types.ObjectId,
    objectiveName : string,
    members : mongoose.Schema.Types.ObjectId[],
    Tasks : [],
    objectiveCalendar : Date,
    description : string,
    Notes : string[],
    HISTORY_TasksAchieved : [],
    defaults: IDefaults
}

const modelSchema = new mongoose.Schema<IObjective>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'post must be associated with a user ID'],
        ref: 'users'
    },
    owningLTG: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, '\'owningLTG\' field is mandatory! please provide it in order to create a new instance of this document type!'],
        ref: 'ltgs'
    },
    objectiveName: {
        type: String,
        required: [true, '\'objectiveName\' field is mandatory! please provide it in order to create a new instance of this document type!']
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
    defaults: {
        type: Object
    }
}, {
    timestamps: true   
});

export default mongoose.model('objectives', modelSchema);