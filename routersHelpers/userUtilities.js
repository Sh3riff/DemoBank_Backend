const Customer = require('../models/customer');

const UpdateAcctHistory = ( acctHistory, amount, newBalance, action, thirdParty) => {
    const time = new Date();

    const transaction = {
        type: action,
        amount: `₦ ${amount}`,
        [action === "debit" ? "to" : "from"]: `${thirdParty}`,
        availableBalance: `₦ ${newBalance}`,
        date: `${time.toDateString().slice(4)} ${time.toTimeString().slice(0,5)}`,
    }
    acctHistory.unshift(transaction);

    return acctHistory;
}

const GenerateAccountDetail = (Account) => {
    let result = {
        firstName: Account.FirstName,
        lastName: Account.LastName,
        acctNo: Account.AccountNumber,
        acctBal: `${Account.AccountBalance}`,
        acctHistory: Account.AccountHistory.slice(0,5),
        email: Account.Email,
        phone: Account.PhoneNumber,
        creditCard: Account.CreditCard,
        role: Account.Role,
        date: Account.Date
    };
    return result
}

const DebitSender = (sender, receiver, amount, res) => {

    Customer.findOne( {AccountNumber: sender },  (err, Account) => {
        if(err) return res.status(500);
        if(!Account) return res.send({status: "error", message:'Account not found!'});        
        
        const initialBalance = `${Account.AccountBalance}`;
        if(initialBalance < amount) return res.send({status: "error", message:'Insuffient balance'});
        const newBalance = (initialBalance - amount).toFixed(2);
        const acctHistory = Account.AccountHistory;

        const newHistory = UpdateAcctHistory(acctHistory, amount, newBalance, "debit", receiver );
        const updatedValue = {AccountBalance: newBalance, AccountHistory : newHistory};

        Customer.findOneAndUpdate( {AccountNumber: sender }, updatedValue , { new: true, upsert: true, useFindAndModify: false }, (err, data) => {
            if(err) return res.send({status: "error", message: 'transaction error, try again'});
            
        })
    })
    
}

const CreditReceiver = (sender, receiver, amount, bank, res) => {

    if (bank !== "Demo Bank") return res.send({status: "done", message: "transaction successful"});

    Customer.findOne( {AccountNumber: receiver }, (err, Account) => {
        if(err) return res.status(500);
        if(!Account) return res.send({status: "done", message: "transaction successful"});;
        const initialBalance = `${Account.AccountBalance}`;
        const newBalance = ( parseFloat(initialBalance) + parseFloat(amount) ).toFixed(2);
        const acctHistory = Account.AccountHistory;

        const newHistory = UpdateAcctHistory(acctHistory, amount, newBalance, "credit", sender);
        const updatedValue = {AccountBalance: newBalance, AccountHistory : newHistory}

        Customer.findOneAndUpdate( {AccountNumber: receiver }, updatedValue, { new: true, upsert: true, useFindAndModify: false }, (err, data) => {
            if(err) return res.send({status: "error", message: 'transaction error, try again'});
            return res.send({status: "done", message: "transaction successful"});;
        })
    })
    
}

module.exports = {
    DebitSender,
    CreditReceiver,
    GenerateAccountDetail
}