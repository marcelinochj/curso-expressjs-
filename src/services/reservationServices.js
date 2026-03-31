const { PrismaClient } = require('@prisma/client');
const { json } = require('body-parser');
const prisma = new PrismaClient();

const createReservation = async data => {

   const conflict = await reservationsConfict(data.date, data.timeBlockId);
    if (conflict){
         throw new Error('Horario ocupado');
    };

    const newResevation = await prisma.appointment.create({data})
    return newResevation;
};


const getReservation = async (idReservation) => {
    const reservation = await prisma.appointment.findFirst({where:{id:parseInt(idReservation)}})
    return reservation;
};

const updateReservation = async (idReservation, data) => {
    const existReservation = await getReservation(idReservation);

    if (!existReservation){
        throw new Error('Reservation not found');
    }

    const conflict = await reservationsConfict(data.date, data.timeBlockId);
    if (conflict){
         throw new Error('Horario ocupado');
    };

    const reservation = await prisma.appointment.update({where:{id:parseInt(idReservation)}, data: data})
    return reservation;
};

const deleteReservation = async (idReservation) => {
    const existReservation = await getReservation(idReservation);

    if (!existReservation){
        throw new Error('Reservation not found');
    }

    const reservation = await prisma.appointment.delete({where:{id:parseInt(idReservation)}})
    return reservation;
}

const reservationsConfict = async (date, timeBlockId) => {
    
    return prisma.appointment.findFirst({
        where:{
            date: new Date(date),
            timeBlockId: parseInt(timeBlockId)
        }
    });
}



module.exports = { createReservation, getReservation, updateReservation, deleteReservation}