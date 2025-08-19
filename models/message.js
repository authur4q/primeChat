import mongoose, { Schema,model,models } from "mongoose";

const messageSchema = new Schema({
    sender_id:{
        type:String,
        required:true
    },
    receiver_id:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },

},{timestamps:true})

const Message = models.Message || mongoose.model("Message",messageSchema)
export default Message