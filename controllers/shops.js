const Shop = require('../models/Shop.js')
const Reservation = require('../models/Reservation.js')
//@desc Get all shops
//@route GET /api/v1/shops
//@access Public
exports.getShops = async (req,res,next) => {
    
    let query;
    // let queryStr = JSON.stringify(req.query);
    // queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g , match => `$${match}`);
    
    // copy req.query
    const reqQuery = {...req.query};

    // Fields to exclude
    const removeFields=['select','sort','page','limit'];

    // Loop over remove firelds and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g , match => `$${match}`);

    query = Shop.find(JSON.parse(queryStr)).populate('reservations'); // ค้นหาข้อมูลตามเงื่อนไขใน queryStr
    
    // Select Fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        qurery = query.sort(sortBy);
    } else {
        query = query.sort('-createAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page,10)||1;
    const limit = parseInt(req.query.limit,10)||25;
    const startIndex = (page-1) * limit;
    const endIndex = page * limit;
    

    try{
        const total = await Shop.countDocuments();
        query = query.skip(startIndex).limit(limit);
        
        // const hospitals = await Hospital.find(req.query);
        
        // Execute query
        const shops = await query;

        // Pageination result
        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page: page + 1,
                limit
            }
        }
        if(startIndex > 0){
            pagination.prev = {
                page: page - 1,
                limit
            }
        }
        // console.log(req.query);
        // console.log("hello");
        res.status(200).json({success:true, count:shops.length, data:shops});
    } catch(err){
        res.status(400).json({succes: false, message:"Cannot find Shop"});
    }
};


//@desc Get single shop
//@route GET /api/v1/shops/:id
//@access Public
exports.getShop = async (req,res,next) => {
    try{
        const shop = await Shop.findById(req.params.id);

        if(!shop){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:shop});

    } catch(err){
        res.status(400).json({success:false});
    }
};


//@desc Create new shop
//@route POST /api/v1/shops
//@access Private
exports.createShop = async (req,res,next) => {
    const shop = await Shop.create(req.body);
    res.status(201).json({
        success: true,
        data:shop
    });
};

//@desc Update shop
//@route PUT /api/v1/shops/:id
//@access Private
exports.updateShop = async (req,res,next) => {
    try{
        const shop = await Shop.findByIdAndUpdate(
            req.params.id,
            req.body, 
            {
                new: true,
                runValiddators:true
        });

        if(!shop){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:shop});
    } catch{
        res.status(400).json({success:false});
    }
};


//@desc Delete shop
//@route DELETE /api/v1/shops/:id
//@access Private
exports.deleteShop = async (req,res,next) => {
    try{
        const shop = await Shop.findByIdAndDelete(req.params.id);

        if(!shop){
            return res.status(400).json({success:false , message:`Shop not found with id fo`});
        }

        await Reservation.deleteMany({shop: req.params.id});
        await Shop.deleteOne({_id: req.params.id});
        res.status(200).json({success:true,data:shop});
    } catch{
        res.status(400).json({success:false});
    }
};

