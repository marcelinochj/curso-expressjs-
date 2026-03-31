const {
    createTimeBlockService, listReservationsServide
} = require('../services/adminServices');

const createTimeBlock = async (req, res) => {
    if (req.user.role !== 'ADMIN'){
        return res.status(403).json({error: 'Access denied'});
    }

    const {startTime, endTime} = req.body;

    try {
        
        const newTimeblock = await createTimeBlockService(startTime, endTime);
        return res.status(201).json(newTimeblock);
    } catch (error) {
        return res.status(500).json({error: 'Error creating time block'});
    }
};

const listReservations = async (req, res) => {
    if (req.user.role !== 'ADMIN'){
        return res.status(403).json({error: 'Access denied'});
    }
    try {
        const reservations = await listReservationsServide();
        return res.status(201).json(reservations);
    } catch (error) {
        return res.status(500).json({error: 'Error fetching reservations'});
    }

};

module.exports = {createTimeBlock, listReservations}

