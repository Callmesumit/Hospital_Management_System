import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Appointment } from "../models/appointmentSchema.js";
import { Message } from "../models/messageSchema.js";
import { User } from "../models/userSchema.js";

export const postAppointment = catchAsyncError(async(req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstName,
        doctor_lastName,
        hasVisited,
        address,
     } = req.body;

     if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !nic ||
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstName ||
        !doctor_lastName ||
        !address
    ) {
        return next(new ErrorHandler("Please Fill Full Form !..", 400));
     }
     const isConflict = await User.find({
        firstName: doctor_firstName,
        lastName: doctor_lastName,
        role: "Doctor",
        doctorDepartment: department
     })
     if(isConflict.length === 0){
        return next(new ErrorHandler("Doctor Not Found !..." , 404));
     }
     if(isConflict.length > 1){
        return next
          (new ErrorHandler(
            "Doctors Conflict Please Conatact Through Email or Phone !..." ,
             404
            )
        );
     }
     const doctorId = isConflict[0]._id;
     const patientId = req.User._id;
     const appointment = await Appointment.create({
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
            firstName: doctor_firstName,
            lastName: doctor_lastName,
        },
        hasVisited,
        address,
        doctorId,
        patientId,
     });
     res.status(200).json({
        success: true,
        Message: "Appointment Send Succcessfully!..",
        appointment,
     })
});

export const getAllAppointments = catchAsyncError(async(req, res, next) => {
   const appointment = await Appointment.find();
   res.status(200).json({
      success: true,
      appointment,
   });
});

export const updateAppointmentStatus = catchAsyncError(async(req, res, next) => {
   const {id} = req.params;
   let appointment = await Appointment.findById(id);
   if (!appointment) {
      return next(new ErrorHandler("Appointment Not Found !.." , 404));
   }
   appointment = await Appointment.findByIdAndUpdate(id, req.body , {
      new: true,
      runValidators: true,
      useFindAndModify: false,
   });
   res.status(200).json({
      success: true,
      massage: "Appointment Status Updated !..",
      appointment,
   });
 }
);

export const deleteAppointment = catchAsyncError(async(req, res, next) => {
   const { id } = req.params;
   let appointment = await Appointment.findById(id);
   if (!appointment) {
      return next(new ErrorHandler("Appointment Not Found!..", 404));
   }
   await appointment.deleteOne();
   res.status(200).json({
      success: true,
      message: "Appointment Deleted",
   });
});