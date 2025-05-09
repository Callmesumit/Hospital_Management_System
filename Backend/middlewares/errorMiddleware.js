class ErrorHandler extends Error{
    constructor(message, statuscode) {
        super(message);
        this.statuscode = statuscode;
    }
}


export const errorMiddleware = (err,req,res,next)=>{
    err.message = err.message || "Internal Server Error";
    err.statuscode = err.statuscode || 500;

    if (err.code === 11000) {
        const message = `duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }
    if (err.name === "JsonWenTokenError") {
        const message = "Json Web Token is Inavalid , Try Agian...";
        err = new ErrorHandler(message,400);
    }
    if (err.name === "TokenExpiredError") {
        const message = "Json Web Token is Inavalid , Try Agian...";
        err = new ErrorHandler(message,400);
    }
    if (err.name === "CasteError") {
        const message = `Inavalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    :err.message;



    return res.status(err.statuscode).json({
        success: false,
        message:errorMessage,
    });
};


export default ErrorHandler;