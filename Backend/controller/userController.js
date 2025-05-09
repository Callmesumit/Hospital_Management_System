import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import {generateToken} from "../utils/jwtToken.js"
import cloudinary from "cloudinary"

export const patientRegisterd = catchAsyncError(async(req,res,next) => {
    const { 
            firstName, 
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            nic,
            role,
        } = req.body;
        if(
            !firstName || 
            !lastName ||
            !email ||
            !phone ||
            !password ||
            !gender ||
            !dob ||
            !nic ||
            !role
        ){
            return next(new ErrorHandler("Please Fill Full Form !...", 400));
        }
        let user = await User.findOne({ email });
        if(user){
            return next(new ErrorHandler("User Already Ragistered...", 400)); 
        }
        user = await User.create({
            firstName, 
            lastName,
            email,
            phone,
            password,
            gender,
            dob,
            nic,
            role,
        });

        generateToken(user,"User Ragistered", 200, res);
        
});

/*
export const login = catchAsyncError(async(req,res,next)=>{
    const {email, password, confirmPassword, role} = req.body;
    if(!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please Provide All Details!...",400));
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler("Password And Confirm Password Do Not Match!..",400))
    }
    const user = await User.findOne({email}).select("+passsword");
    if(!user){
        return next(new ErrorHandler("Invalied Password Or Email....",400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalied Password Or Email...",400));
    }
    if(role !== user.role){
        return next(new ErrorHandler("user With this Role Not Found",400));
    }
    res.status(200).json({
        success: true,
        message: "User Logged In Succesfully..",
    });
});
*/

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword || !role) {
        return next(new ErrorHandler("Please Provide All Details!...", 400));
    }
    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password And Confirm Password Do Not Match!..", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Password Or Email....", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Password Or Email...", 400));
    }
    if (role !== user.role) {
        return next(new ErrorHandler("User With this Role Not Found", 400));
    }
    generateToken(user,"User Login Succesfully", 200, res);
});


export const addNewAdmin = catchAsyncError(async(req, res, next) => {
    const {
        firstName, 
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
    } = req.body;
    if(
        !firstName || 
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !gender ||
        !dob ||
        !nic 
    ) {
        return next(new ErrorHandler("Please Fill Full Form !...", 400));
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("Admin With This Email Already Registered !.."));
    }
    const admin = await User.create({
        firstName, 
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role : "Admin",
    });
    res.status(200).json({
        success: true,
        message: "New Admin Registered !",
    });
});

export const getAllDoctors = catchAsyncError(async(req, res, next) => {
    const doctors = await User.find({role:"Doctor"});
    res.status(200).json({
        success: true,
        doctors 
    });
});

export const getUserDetails = catchAsyncError(async(req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});


export const logoutAdmin = catchAsyncError(async(req, res, next) => {
    res.status(200)
    .cookie("adminToken","", {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    .json({
        success: true,
        message: "Admin Log-Out Successfully!..",
    });
});

export const logoutPatient = catchAsyncError(async(req, res, next) => {
    res.status(200)
    .cookie("patientToken","", {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    .json({
        success: true,
        message: "Patient Log-Out Successfully!..",
    });
});


export const addNewDoctor = catchAsyncError(async(req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Doctor Avatar Required !..",400));
    }
    const {docAvatar} = req.files;
    const allowedFormats = ["image/png","image/jpeg","image/webp"];
    if (!allowedFormats.includes(docAvatar.mimetype)) {
        return next(new ErrorHandler("Files Formate Not Supported!.." ,400));
    }
    const {
        firstName, 
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        } = req.body;
        if (
            !firstName || 
            !lastName ||
            !email ||
            !phone ||
            !password ||
            !gender ||
            !dob ||
            !nic ||
            !doctorDepartment
        ) {
            return next(new ErrorHandler("Please Provide Full Detail !..",400));
        }
        const isRegistered = await User.findOne({ email });
        if (isRegistered) {
            return next(
            new ErrorHandler(
                `${isRegistered.role} already registered with this Email`,
                400
            )
        );
    }
    const cloudinaryResponse = await cloudinary.Uploader.upload(
        docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary Error : ",
            cloudinaryResponse.error || "Unkonown Cloudinary Error"
        );
    }
    const doctor = await User.create({
        firstName, 
        lastName,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctorDepartment,
        role:"Doctor",
        docAvtar:{
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(200).json({
        success: true,
        message: "New Doctor Registered!..",
        doctor
    });
});
