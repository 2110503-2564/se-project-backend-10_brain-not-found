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
    tel: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true,
        match: [
            /^(\d{3}-?\d{3}-?\d{4})$/, 
            'Please add a valid phone number'
        ]
    },
    region:{
        type: String,
        required: [true, 'Please add a region']
    },
    openTime: {
        type: String,
        required: [true, 'Please add an open time'],
        match: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, 'Please add a valid open time in HH:MM format']
    },
    closeTime: {
        type: String,
        required: [true, 'Please add a close time'],
        match: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, 'Please add a valid close time in HH:MM format']
    }

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

module.exports=mongoose.model('Shop',ShopSchema);
