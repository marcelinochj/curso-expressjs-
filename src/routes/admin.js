const { Router } = require('express');
const { createTimeBlock, listReservations } = require('../controllers/adminController');
const autenticateToken = require('../middlewares/auth');

const router = Router();

router.post('/time-blocks', autenticateToken, createTimeBlock);
router.get('/reservations', autenticateToken, listReservations);

module.exports = router;