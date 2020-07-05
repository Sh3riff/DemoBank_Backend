const router = require('express').Router();
const { accountDetail, transferVerification, transfer, updateProfile, updatePassword, allCustomerAccount} = require('../routersHelpers/userAbstractions');

router.get( '/accountDetails/:token', accountDetail());

router.get( '/verifyAccount/:accountNumber', transferVerification() );

router.patch( '/updateProfile', updateProfile() );

router.patch( '/updatePassword', updatePassword() );

router.patch( '/transfer', transfer());

router.get( '/allCustomerAccount/', allCustomerAccount());

module.exports = router;