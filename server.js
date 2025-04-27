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
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Massage Shop Reservation API',
            version: '1.0.0',
            description: 'A simple Express Message Shop reservation API'
        },
        servers: [{
            url: process.env.HOST + ":" + PORT
        }],
        components: {
            schemas: {
                Request: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'The unique identifier of the request.',
                            example: '654321abcdef0123456789'
                        },
                        user: {
                            type: 'string',
                            description: 'The ID of the user who created the request.',
                            example: '654321fedcba9876543210'
                        },
                        shop: {
                            $ref: '#/components/schemas/Shop'
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'approved', 'rejected'],
                            description: 'The status of the request.',
                            example: 'pending'
                        },
                        requestType: {
                            type: 'string',
                            enum: ['create', 'update', 'delete'],
                            description: 'The type of request action.',
                            example: 'create'
                        },
                        reason: {
                            type: 'string',
                            description: 'The reason for the request (if applicable).',
                            example: 'Request for new shop'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The timestamp when the request was created.',
                            example: '2024-01-01T00:00:00.000Z'
                        },
                        edited: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The timestamp when the request was last updated.',
                            example: '2024-01-02T12:00:00.000Z'
                        }
                    }
                },
                Shop: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'The unique identifier of the shop.',
                            example: '654321abcdef0123456789'
                        },
                        name: {
                            type: 'string',
                            description: 'The name of the shop.',
                            example: 'My Shop'
                        },
                        address: {
                            type: 'string',
                            description: 'The address of the shop.',
                            example: '123 Main St'
                        },
                        district: {
                            type: 'string',
                            description: 'The district where the shop is located.',
                            example: 'Downtown'
                        },
                        province: {
                            type: 'string',
                            description: 'The province where the shop is located.',
                            example: 'Bangkok'
                        },
                        postalcode: {
                            type: 'string',
                            description: 'The postal code of the shop.',
                            example: '10110'
                        },
                        tel: {
                            type: 'string',
                            description: 'The phone number of the shop.',
                            example: '02-123-4567'
                        },
                        region: {
                            type: 'string',
                            description: 'The region of the shop.',
                            example: 'Central'
                        },
                        openTime: {
                            type: 'string',
                            description: 'The opening time of the shop in HH:MM format.',
                            example: '09:00'
                        },
                        closeTime: {
                            type: 'string',
                            description: 'The closing time of the shop in HH:MM format.',
                            example: '18:00'
                        },
                        picture: {
                            type: 'array',
                            description: 'Array of picture URLs.',
                            items: { type: 'string' },
                            example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
                        },
                        desc: {
                            type: 'string',
                            description: 'A description of the shop.',
                            example: "A cozy massage shop offering relaxation and therapy services."
                        },
                        shopType: {
                            type: 'string',
                            description: 'The type or category of the shop.',
                            example: 'Massage'
                        },
                        services: {
                            type: 'array',
                            description: 'List of services offered by the shop.',
                            items: {
                                type: 'object',
                                properties: {
                                    name: {
                                        type: 'string',
                                        description: 'The service name.',
                            example: 'Swedish Massage'
                                    },
                                    desc: {
                                        type: 'string',
                                        description: 'A description of the service.',
                                        example: 'A relaxing full-body massage.'
                        },
                        duration: {
                                        type: 'number',
                                        description: 'Duration in minutes.',
                                        example: 60
                                    },
                                    price: {
                                        type: 'number',
                                        description: 'Price of the service.',
                                        example: 50
                                    }
                                }
                            }
                        },
                        certificate: {
                            type: 'string',
                                                        description: 'Certificate of the shop.',
                            example: "Valid Health Certificate"
                        }
                    }
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Bearer token is required to access this API'
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js']
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
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization"
}));