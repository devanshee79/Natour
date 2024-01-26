const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log(err)
    console.log('UNHANDLELED EXCEPTION SHUTTING DOWN SERVER.....');
    process.exit(1);
})

const app = require("./app");
dotenv.config({path: './config.env'});
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(DB)
    .then(() => console.log('DB connection successful'));

    // ONE OF THE FUNCTION OF EXRPESS IS TO LISTEN TO A PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
})


// unhandled error
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLELED REJECTION SHUTTING DOWN SERVER.....')
    server.close(() => {
        process.exit(1);
    });
});

