import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    img: {
        type: String,
        required: true
    },

    desc: {
        type: String,
        max: 400,
    },

    likes: {
        type: Array,
        default: []
    },

    comments: {
        type: Array,
        userId: {
            type: String,
            required: true
        },
        value:{
            type: String,
            required: true
        }
    }

}, {timestamps:true});

 

export default mongoose.model('Post', postSchema);