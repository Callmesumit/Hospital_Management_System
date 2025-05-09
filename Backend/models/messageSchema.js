import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: [3,"First Name Must Contain At Least 3 Cherecters!.."]
    },
    lastName:{
        type: String,
        required: true,
        minLength: [3,"Last Name Must Contain At Least 3 Cherecters!.."]
    },
    email:{
        type: String,
        required: true,
        validate: [validator.isEmail,"Please Provide A valid Email !.."]
    },
    phone:{
        type: String,
        required: true,
        minLength: [10,"Phone Number Must Contain Exact 10 digit!.."],
        maxLength: [10,"Phone Number Must Contain Exact 10 digit!.."]
    },
    message:{
        type: String,
        required: true,
        minLength: [10,"Message Must Contain At Least 10 Cherecter"]
    },
});

export const Message = mongoose.model("Message",messageSchema);