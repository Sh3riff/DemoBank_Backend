const { Crypt, Compare } = require('password-crypt');
const Customer = require('../models/customer');
const { registerationValidation, loginValidation } = require('../utilities/modelValidator');
const { accountNumberGenerator, cvcGenerator, creditcardExpGenerator, tokenGenerator } = require('./authUtilities');

const register = () => {
    return async (req, res) => {
        try {
            await registerationValidation(req.body)
        } catch (err) {
            return res.send(err.details[0].message)
        }
        
        const lowerCasedEmail = req.body.email.toLowerCase().trim();
    
        await Customer.findOne( { Email: lowerCasedEmail }, async (err, email) => {
            if(err) return res.status(500)
            if(email) return res.send({ status: "error", message:'Account exist!'});

            let newAccountNumber = accountNumberGenerator();

            const issueAccountNumber = await Customer.findOne( { AccountNumber: newAccountNumber }, (err, acctNo) => {
                if(err) return res.sendStatus(500);
                if(!acctNo) return;
                newAccountNumber = accountNumberGenerator()
                issueAccountNumber()
            });

            const hashedPassword = await Crypt(process.env.PASSWORD_SECRET, req.body.password)

            const customer = new Customer( {
                LastName: req.body.lastname,
                FirstName: req.body.firstname,
                Email: lowerCasedEmail,
                PhoneNumber: req.body.phone,
                Password: hashedPassword,
                AccountNumber: newAccountNumber,
                AccountBalance: 1000000.00,
                AccountHistory: [],
                CreditCard: {
                    number: "555500"+newAccountNumber,
                    exp: creditcardExpGenerator(),
                    cvc: cvcGenerator()
                }
            });

            await customer.save( ( err, regCustomer) => {
                if(err) return res.status(400).send({message: "cannot save user", val: err});
                res.send({ 
                    status: "created", 
                    message:`${regCustomer.Email} has been created, you may login now.`
                });
            } );    
        });

        

    }
};

const login = () => {
    return async (req, res) => {
        try {
            await loginValidation(req.body)
        } catch (err) {
            return res.status(400).send(err.details[0].message);
        }
        
        const lowerCasedEmail = req.body.email.toLowerCase().trim(); 
        await Customer.findOne( {Email: lowerCasedEmail }, async (err, user) => {
            if(err) return res.status(500);
            if(!user) return res.send({status: "error", message:'Invalid Credentials!'});
            const verified = await Compare(process.env.PASSWORD_SECRET, req.body.password, user.Password)
            if( !verified ) return res.send({status: "error", message:'Invalid Credentials!'});
            tokenGenerator(user, res)
        })
    }
};

module.exports = {
    register,
    login
};