import mongoose from "mongoose";
const modelSchema = new mongoose.Schema({
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
