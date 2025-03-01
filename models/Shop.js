const mongoose = require('mongoose');
const ShopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true, 'Please add an address']
    },
    district:{
        type: String,
        required: [true, 'Please add a district']
    },
    province:{
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true, 'Please add a postalcode'], maxlength:[5, 'Postal Code can not be more than 5 digits']
    },
    tel:{
        type: String
    },
    region:{
        type: String,
        required: [true, 'Please add a region']
    }, 

}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

// Reverse populate with virtuals
ShopSchema.virtual('reservations' , {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'massageShop',
    justOne:false
});

module.exports=mongoose.model('MassageShop',ShopSchema);
