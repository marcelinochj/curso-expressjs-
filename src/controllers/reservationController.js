const reservationServices = require('../services/reservationServices');

exports.createReservation = async (req, res) => {
    if (req.user.role !== 'ADMIN'){
        return res.status(403).json({error: 'Access denied'});
    }
    
    try{
        const newReservation = await reservationServices.createReservation(req.body);
        return res.status(201).json({messaje: "Reservacion creada correctamente", data: newReservation}) ;
    }catch(error){
        return res.status(500).json({error: error.message});
    }
};

exports.getReservation = async (req, res) => {
    if (req.user.role !== 'ADMIN'){
        return res.status(403).json({error: 'Access denied'});
    }

    try{
        const reservation = await reservationServices.getReservation(req.params.id);
        if (!reservation){
            return res.status(404).json({error: 'Reservation not found'});
        }
        return res.status(201).json(reservation);
    }catch(error){
        return res.status(500).json({error: error.message});
    }

};

exports.updateReservation = async (req, res) => {
    if (req.user.role !== 'ADMIN'){
        return res.status(403).json({error: 'Access denied'});
    }

    try {
        const updateReservation = await reservationServices.updateReservation(req.params.id, req.body) 
        return res.status(201).json({messaje: "Reservacion modificada correctamente", data:updateReservation});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

exports.deleteReservation = async (req, res) => {
    if (req.user.role !== 'ADMIN'){
        return res.status(403).json({error: 'Access denied'});
    }

    try {
        const updateReservation = await reservationServices.deleteReservation(req.params.id) 
    return res.status(201).json({messaje: "Reservacion eliminada correctamente", data: updateReservation});
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
    

};

