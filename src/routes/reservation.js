const { Router } = require('express');
const autenticateToken = require('../middlewares/auth');
const reservationController = require('../controllers/reservationController')
const router = Router();

router.post('/', autenticateToken, reservationController.createReservation);
router.get('/getReservation/:id', autenticateToken, reservationController.getReservation);
router.put('/updateReservation/:id', autenticateToken, reservationController.updateReservation);
router.delete('/deleteReservation/:id', autenticateToken, reservationController.deleteReservation);


module.exports = router;