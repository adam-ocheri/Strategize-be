import mongoose from "mongoose";
const modelSchema = new mongoose.Schema({
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
    },
    defaults: {
        type: Object
    }
}, {
    timestamps: true
});
export default mongoose.model('ltgs', modelSchema);
