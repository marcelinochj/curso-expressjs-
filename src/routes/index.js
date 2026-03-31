const { Router } = require('express');
const router = Router();

const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const reservationRoutes = require('./reservation')

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/reservation', reservationRoutes);

module.exports = router;