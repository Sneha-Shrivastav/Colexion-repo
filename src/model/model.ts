import * as mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    username:{
        type : String,
        required : true,
        trim : true,
        unique :true
    },
    email: {
        type: String,
        requried: true,
        trim:true,
        match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },
    password: {
        type: String,
        requried: true,
        unique: true
    },
    wallet: {
        type : [String]
    }
},{ timestamps: true })

const User = mongoose.model('user', userSchema);
export default User;