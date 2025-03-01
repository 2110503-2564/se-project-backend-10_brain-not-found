const Reservation = require('../models/Reservation');
const MassageShop = require('../models/Shop');
//@desc     Get all reservations
//@route    Get /api/v1/reservations
//@access   Public
exports.getReservations = async (req,res,next) => {
    let query;
    
    // General users can see only their reservations!
    if(req.user.role !== 'admin'){
        // console.log("admin");
        query = Reservation.find({user:req.user.id}).populate({
            path: 'shop',
            select: 'name province tel'
        });
    } else { //If you are an admin, you can see all!
        // console.log("else");
        if (req.params.shopId){
            // console.log("hello" + req.params.shopId);
            query = Reservation.find({ shop: req.params.shopId }).populate({
                path: 'shop',
                select: 'name province tel'
            });
        } else { 
            // console.log("Hello");
            query = Reservation.find().populate({
                path: 'shop',
                select: 'name province tel'
            });
        }
    }
    // } else { // if you are an admin, you can see all!
    //     query = Reservation.find().populate({
    //         path: 'shop',
    //         select: 'name province tel'
    //     });
    // }

    try {
        const reservations = await query;

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({success: false,message:"Cannot find Reservation"});
    }
};

//@desc Get single reservation
//@route GET /api/v1/reservations/:id
//@access Public
exports.getReservation = async (req,res,next) => {
    try {
        const reservation = await Reservation.findById(req.params.id).populate({
            path: 'shop',
            select: 'name description tel'
        });

        if(!reservation){
            return res.status(404).json({success:false, message:` No reservation with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success: true,
            data: reservation
        });

    } catch(error) {
        console.log(error);
        return res.status(500).json({success:false, message:"Cannot find Reservation"});
    }
};

//@desc Add single reservation
//@route Post /api/v1/shop/:shopId/reservations/
//@access Private
exports.addReservation = async (req,res,next) => {
    try {
        req.body.shop = req.params.shopId;

        const shop = await shop.findById(req.params.shopId);

        if(!shop){
            return res.status(404).json({success: false, message: `NO massage Shop with the id of ${req.params.shopId}`});
        }

        //add user Id to req.body
        req.body.user = req.user.id;
        //Check for existed reservation
        const existedReservations = await Reservation.find({user:req.user.id});
        //If the user is not an admin, they can only create 3 reservation.
        if(existedReservations.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:` The user with ID ${req.user.id} has already made 3 reservations`});
        }
        const reservations = await Reservation.create(req.body);
        res.status(200).json({success: true , data: reservations});

    } catch(error) {
       console.log(error.stack);
       return res.status(500).json({success: false, message: 'Can not create reservation'});
    }
};

//@desc Update reservation
//@route PUT /api/v1/reservations/:id
//@access Private
exports.updateReservation = async (req,res,next) => {
    try{
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success: false, message: `No appt with id ${req.params.id}`});
        }

        //Make sure user is the reservation owner
        if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reservation`});
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        res.status(200).json({success: true, data: reservation});
    } catch(err){
        console.log(err.stack);
    return res.status(500).json({success: false, message: "Cannot uodate Reservation"});
    }
};


//@desc Delete reservation
//@route Delete /api/v1/reservations/:id
//@access Private
exports.deleteReservation = async (req,res,next) => {
    try{
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success: false, message: `No appt with id ${req.params.id}`});
        }

        //Make sure user is the reservation owner
        if(reservation.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this reservation`});
        }
        
        await reservation.deleteOne();

        res.status(200).json({success: true, data: reservation});
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({success: false, message: "Cannot delete Reservation"});
    }

};
