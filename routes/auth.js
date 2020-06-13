const router = require('express').Router();
const { register, login } = require('./authAbstractions');

router.post('/register', register());
router.post('/login', login());

module.exports = router;