const express = require("express");
const router = express.Router();

const QuickWalletMastersController = require('../controllers/paymentgateway');

router.get('/list', QuickWalletMastersController.fetch_details);

router.get('/quickwallet-redirecturl', QuickWalletMastersController.paymentResponse);

router.post('/payment',QuickWalletMastersController.makepayment);


// router.post('/exampurchase/:studentId/:competitionId/:compfees',QuickWalletMastersController.paymentGatewayforCompetition);

module.exports = router;