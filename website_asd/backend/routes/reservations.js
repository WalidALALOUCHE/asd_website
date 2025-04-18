const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Create new reservation
router.post('/', auth, async (req, res) => {
    try {
        const { seatNumber, paymentMethod, amount, eventDate } = req.body;

        // Check if seat is already reserved
        const existingReservation = await Reservation.findOne({
            seatNumber,
            eventDate,
            status: { $ne: 'cancelled' }
        });

        if (existingReservation) {
            return res.status(400).json({ message: 'Seat is already reserved' });
        }

        const reservation = new Reservation({
            user: req.user._id,
            seatNumber,
            paymentMethod,
            amount,
            eventDate
        });

        await reservation.save();

        // Add reservation to user's reservations
        await User.findByIdAndUpdate(req.user._id, {
            $push: { reservations: reservation._id }
        });

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error creating reservation', error: error.message });
    }
});

// Get user's reservations
router.get('/my-reservations', auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservations', error: error.message });
    }
});

// Cancel reservation
router.patch('/:id/cancel', auth, async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
    }
});

module.exports = router; 