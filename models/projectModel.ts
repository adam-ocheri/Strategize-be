import mongoose from "mongoose";


interface IProject {
    //TODO : Should conceive these functions elsewhere
    //*IsTeamProject() : {return Members.length>1}
    //*GetSelfRole() : string ['Admin' | 'Member']

    //dummy data for now
    owner: mongoose.Schema.Types.ObjectId;
    data: string;

    //critical data
    stationType : 'Project';
    stationTypeName : string,
    projectName : string,
    projectIconImg : string
    members : mongoose.Schema.Types.ObjectId[],
    longTermGoals : [],//LTG,
    projectCalendar : Date,
    description : string,
    Notes : string[],
    HISTORY_LTGsAchieved : []
}

const modelSchema = new mongoose.Schema<IProject>({
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