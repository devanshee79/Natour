const AppError = require('./../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
}

const handleDuplicateFieldDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!!`;
    return new AppError(message, 400);
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errorsmap(el => el.message));
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}

const handleJWTError = err => new AppError('Invalid token. Please login again', 401)

const handleJWTExpiredError = err => new AppError('Your token is expired please login again', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const sendErrorProd = (req, res) => {
    // trusted error 
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } 
    // unexpected error, do not show to client
    else{
        // logging error
        console.log(err)

        res.status(500).json({
            status: 'error',
            message: 'something went very wrong'
        });
    }
}

module.exports = (err, req, res, next) => {
    console.log(err.stack);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if(process.env.NODE_ENV === "development"){
        sendErrorDev(err, res)
    } else if(process.env.NODE_ENV === "development"){
        let error = {...err };

        if(error.name === "CastError") error = handleCastErrorDB(error);
        if(error.code === 11000) error = handleDuplicateFieldDB(error);
        if(error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if(error.name === "JsonWebTokenError") error = handleJWTError(error);
        if(error.name === "TokenExpiredError") error = handleJWTExpiredError(error);
        

        sendErrorProd(err, res);
    }
   
}