const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
//Route files
const hospitals =require('./routes/hospitals');
const appointments = require('./routes/appointments');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const auth = require('./routes/auth');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//Load env vars
dotenv.config({path:'./config/config.env'});
//Connect to database
connectDB();

const app = express();
const swaggerOptions={
    swaggerDefinition:{
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple Express VacQ API'
        },
        servers:[{url: 'http://localhost:5000/api/v1'}],
    },
    apis:['./routes/*.js'],
};
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));
//Body parser
app.use(express.json());
//Sanitize data
app.use(mongoSanitize());
//Set security headers
app.use(helmet());
//Cookie parser
app.use(cookieParser());
//Prevent XSS attacks
app.use(xss());
//Rate Limiting
const limiter=rateLimit({
    windowsMs:10*60*1000,//10 mins
    max: 100
});
app.use(limiter);
//Prevent http param pollutions
app.use(hpp());
//Enable CORS
app.use(cors());



app.use('/api/v1/hospitals',hospitals);
app.use('/api/v1/auth',auth);

app.use('/api/v1/appointments',appointments);


// การสั่ง run server
const PORT = process.env.PORT || 5000; // ถ้า env ลืม set PORT ให้ใช้ 5000 แทน

const server = app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode onport PORT'));

//Handle unhandled promise rejections 
process.on('unhandledRejection' , (err,promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});