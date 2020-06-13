const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const { DebitSender, CreditReceiver, GenerateAccountDetail } = require('./userUtilities');

const accountDetail = () => {
    return async (req, res) => {        
        const accountNumber = req.user;
        if(accountNumber === 'noAuth') return res.send({status: "noAuth", message:'user Authentication error'});
        Customer.findOne( {AccountNumber: accountNumber }, (err, Account) => { 
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
        const sender = req.user;
        const receiver = req.body.receiver;
        const bank = req.body.bank;
        const amount = req.body.amount;

        DebitSender(sender, amount, res);
        CreditReceiver(receiver, amount, res);
    }
};

const updateProfile = () => {
    return (req, res) => {
        const accountNumber = req.user;
        const updateValue = {
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
        const accountNumber = req.user;
        const oldpassword = req.body.oldpassword;
        const newpassword =  req.body.newpassword;
    
        Customer.findOne( {AccountNumber: accountNumber }, (err, Account) => {
            if(err) return res.status(500);
    
            bcrypt.compare(oldpassword, Account.Password, async (err, password) => {
                if(err) return res.status(500);                    
                if(!password) return res.send({status: "error", message:'old password is incorrect'});
                
                bcrypt.hash(newpassword, 10, async (err, hashedPassword) => {
                    if(err) return res.status(500);
    
                    Customer.findOneAndUpdate( {AccountNumber: accountNumber }, { Password: hashedPassword }, { new: true, upsert: true, useFindAndModify: false }, (err, data) => {
                        if(err) return res.send({status: "error", message:'update error, try again.'});
                        return res.send({status: "done", message: "update successful"});
                    })
                })            
            });        
        })
    }

};


module.exports = {
    accountDetail,
    transfer,
    transferVerification,
    updatePassword,
    updateProfile,
};