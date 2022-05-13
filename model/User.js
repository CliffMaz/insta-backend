import mongoose from 'mongoose';


const userSchema = mongoose.Schema({

    fullName:{
        type: String,
        required: true,
        min: 6,
        max: 255,
        default:""
    },

    username:{
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true
    },

    email:{
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true
    },

    profileDisplay:{
        type: String,
        required: false
    },

    password:{
        type: String,
        required: true,
        min: 6,
        max: 1024
    },

    bio:{
        type: String,
        default:"",
        min: 6,
        max: 255
    },

    followers:{
        type: Array,
        default: []
    },

    following:{
        type: Array,
        default: []
    },

    date:{
        type: Date,
        default: Date.now
        
    }

},{timestamps: true});

export default mongoose.model('User',userSchema);