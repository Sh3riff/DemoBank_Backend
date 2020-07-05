const { Crypt, Compare } = require('password-crypt');
const Customer = require('../models/customer');
const {  DebitSender, CreditReceiver, GenerateAccountDetail } = require('./userUtilities');
const jwt = require('jsonwebtoken');

const accountDetail = () => {
    return async (req, res) => {
        const token = req.params.token
        let accountNo;

        await jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
            if(err) return;
            accountNo = user.AccountNumber
        })

        Customer.findOne( {AccountNumber: accountNo }, (err, Account) => { 
            if(err) return res.status(500);
            let result = GenerateAccountDetail(Account);
            return res.send({status: 'done', message: result });
        })
    
    }
};

const transferVerification = () => {
    return (req, res) => {
        const accountNumber = req.params.accountNumber;
        Customer.findOne( {AccountNumber: accountNumber }, (err, Account) => {
            if(err) return res.status(500);
            if(!Account) return res.send({status: "error", name:'Account number does not exist!'});
            return res.send({status: "done", name: `${Account.FirstName} ${Account.LastName}`});
        })
    }
}; 

const transfer = () => {
    return async (req, res) => {
        const sender =  req.body.accountNumber;
        const receiver = req.body.receiver;
        const bank = req.body.bank;
        const amount = req.body.amount;

        DebitSender(sender, receiver, amount, res);
        CreditReceiver(sender, receiver, amount, bank, res);
    }
};

const updateProfile = () => { 
    return (req, res) => {
        const accountNumber =  req.body.accountNumber;
        const updateValue = {
            Email: req.body.email,
            LastName: req.body.lastname,
            FirstName: req.body.firstname,
            PhoneNumber: req.body.phone
        }

        Customer.findOneAndUpdate( {AccountNumber: accountNumber }, updateValue, { new: true, upsert: true, useFindAndModify: false }, (err, data) => {
            if(err) return res.send({status: "error", message:'update error, try again.'});
            return res.send({status: "done", message: "update successful"});
        })
    
    }
}

const updatePassword = () => {
    return (req, res) => {
        const accountNumber = req.body.accountNumber;
        const oldpassword = req.body.oldpassword;
        const newpassword =  req.body.newpassword;
    
        Customer.findOne( {AccountNumber: accountNumber }, async (err, Account) => {
            if(err) return res.status(500);
            const verified = await Compare(process.env.PASSWORD_SECRET, oldpassword, Account.Password)
            if(!verified) return res.send({status: "error", message:'old password is incorrect'});
            const hashedPassword = await Crypt(process.env.PASSWORD_SECRET, newpassword)
            Customer.findOneAndUpdate( {AccountNumber: accountNumber }, { Password: hashedPassword }, { new: true, upsert: true, useFindAndModify: false }, (err, data) => {
                if(err) return res.send({status: "error", message:'update error, try again.'});
                return res.send({status: "done", message: "update successful"});
            })    
        })
    }

};

const allCustomerAccount = () => {
    return async (req, res) => {
        Customer.find( {}, (err, Account) => { 
            if(err) return res.status(500);
            let result = Account.map(person => GenerateAccountDetail(person) );
            return res.send({status: 'done', data: result });
        })
    }
};

module.exports = {
    accountDetail,
    transferVerification,
    transfer,
    updateProfile,
    updatePassword,
    allCustomerAccount
};