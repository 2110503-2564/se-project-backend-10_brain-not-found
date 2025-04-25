const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
//Route files
const shop =require('./routes/shops');
const reservations = require('./routes/reservations');
const review = require('./routes/reviews')
const request = require('./routes/requests');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const {xss}=require('express-xss-sanitizer');
const auth = require('./routes/auth');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
// การสั่ง run server
const PORT = process.env.PORT || 5000; // ถ้า env ลืม set PORT ให้ใช้ 5000 แทน
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
            description: 'A simple Express Message Shop reservation API'
        },
        servers:[{
            url: process.env.HOST + ":" + PORT + '/api/v1'
        }],
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
    max: 25000
});
app.use(limiter);
//Prevent http param pollutions
app.use(hpp());
//Enable CORS
app.use(cors());

app.use('/api/v1/shops',shop);
app.use('/api/v1/auth',auth);
app.use('/api/v1/reservations',reservations);
app.use('/api/v1/reviews', review);
app.use('/api/v1/requests', request);

const server = app.listen(
    PORT, 
    console.log('Server running in ', process.env.NODE_ENV, ' on ' + process.env.HOST + ":" + PORT
));

//Handle unhandled promise rejections 
process.on('unhandledRejection' , (err,promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

app.use(cors({
    origin: "http://localhost:3000", // อนุญาตเฉพาะ frontend ที่รันบน localhost:3000
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));