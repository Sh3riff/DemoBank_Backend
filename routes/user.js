const router = require('express').Router();
const { accountDetail, transfer, transferVerification, updateProfile, updatePassword } = require('./userAbstractions');

router.get( '/accountDetails', accountDetail());

router.get( '/verifyAccount/:accountNumber', transferVerification() );

router.patch( '/updateProfile', updateProfile() );

router.patch( '/updatePassword', updatePassword() );

router.patch( '/transfer', transfer());

module.exports = router;