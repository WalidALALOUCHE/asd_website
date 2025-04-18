const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    eventDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation; 