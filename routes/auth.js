const router = require('express').Router();
const { register, login } = require('../routersHelpers/authAbstractions');

const test = () => {
    return async (req, res) => {
        return res.send({success: 'get call succeed!', url: req.url, body: req.body});
    }
};

router.post('/test', test());

router.post('/register', register());
router.post('/login', login());

module.exports = router;