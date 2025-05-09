import mongoose  from "mongoose";


export const dbConnection = () => {
    mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "HOSPITAL_MANAGEMENT_SYSTEM",
    })
    .then(()=>{
        console.log("Yeh! Finally Database Connected");
    })
    .catch((err) => {
        console.log(`Some error occured while connectiing to database: ${err}`);
    });

}