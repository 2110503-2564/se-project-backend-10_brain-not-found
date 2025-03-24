const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    reservationDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    shop: {
        type: mongoose.Schema.ObjectId,
        ref: 'Shop',
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    picture: {
        type: String,
        required: [true, 'Please add a picture\n']
    }
});

module.exports = mongoose.model('Reservation',ReservationSchema);