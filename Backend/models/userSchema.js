import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
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
    nic:{
        type: String,
        required: true,
        minLength: [13,"NIC Must Contain 13 digits!.."],
        maxLength: [13,"NIC Must Contain 13 digits!.."]
    },
    dob: {
        type: Date,
        required: [true, "DOB is required !.."], 
    },
    gender:{
        type: String,
        required: true,
        enum: ["Male","Female"],
    },
    password: {
        type: String,
        minLength: [8,"Password Must Contain At least 8 Charecter!.."],
        required: true,
        select: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin","Patient","Doctor"],
    },
    doctorDepartment: {
        type: String,

    },
    docAvtar: {
        public_id: String,
        url: String,
    },
});
/*

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();       
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.genrateJsonWebToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRES,
    });
};
*/

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!enteredPassword) {
        throw new Error("Entered password is required");
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

/* export const User = mongoose.model("User", userSchema); */

export const User = mongoose.model("User",userSchema);
