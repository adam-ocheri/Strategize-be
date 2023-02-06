import mongoose from "mongoose";


interface ILTG {
    //TODO : Should conceive these functions elsewhere
    //*IsTeamProject() : {return Members.length>1}
    //*GetSelfRole() : string ['Admin' | 'Member']

    //dummy data for now
    owner: mongoose.Schema.Types.ObjectId;
    data: string;

    //critical data
    stationType : 'LTG';
    stationTypeName : string,
    owningProject : mongoose.Schema.Types.ObjectId,
    LTGName : string,
    members : mongoose.Schema.Types.ObjectId[],
    Objectives : [],
    ltgCalendar : Date,
    description : string,
    Notes : string[],
    HISTORY_ObjectivesAchieved : []
}

const modelSchema = new mongoose.Schema<ILTG>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'post must be associated with a user ID'],
        ref: 'users'
    },
    owningProject: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, '\'owningProject\' field is mandatory! please provide it in order to create a new instance of this document type!'],
        ref: 'projects'
    },
    LTGName: {
        type: String,
        required: [true, '\'LTGName\' field is mandatory! please provide it in order to create a new instance of this document type!']
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

export default mongoose.model('ltgs', modelSchema);