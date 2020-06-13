const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshtoken');

const accountNumberGenerator = () => {
    const bankCode = "2020";
    let customerNumber = Math.floor(Math.random() * 1000000);
    return bankCode + customerNumber;
};

const cvcGenerator = () => {
    const generated = Math.floor(Math.random() * 1000);
    if(generated < 10) return cvcGenerator();
    if(generated < 100) return "0"+generated
    return generated

};

const creditcardExpGenerator = () => {
    const datt = new Date();
    const month = datt.getMonth()+1;
    if(month < 10) return `0${month}${datt.getFullYear().toString().slice(2)}`
    return `${month}${datt.getFullYear().toString().slice(2)}`
};

const UpdateTokenArray = ( tokenArray, newToken) => {
    tokenArray.push(newToken);
    return tokenArray;
}

const tokenGenerator = async (user, res) => {
    const { AccountNumber, Role } = user;

    const accessToken = await jwt.sign( { AccountNumber, Role}, process.env.JWT_ACCESS_TOKEN, {expiresIn: '10d'} );
    const refreshToken = await jwt.sign( { AccountNumber, Role}, process.env.JWT_REFRESH_TOKEN, {expiresIn: '100d'} );

    const createToken ={
        AccountNumber: AccountNumber,
        refreshToken: refreshToken
    };

    await RefreshToken.findOne( { AccountNumber: AccountNumber }, (err, hasToken) => {
        if(err) return res.send({message: 'Refresh Token error'});

        if(!hasToken) return RefreshToken.findOneAndUpdate( { AccountNumber: AccountNumber }, createToken, { new: true, upsert: true, useFindAndModify: false }, (err, data) => {
            if(err) return res.send({message: 'Refresh Token error'});
            return res.send({status: "done", message: "user logged in", accessToken: `Bearer ${accessToken}`, refreshToken: `Bearer ${refreshToken}`});
        });

        const updateToken ={ Token: UpdateTokenArray(hasToken.Token, refreshToken) };

        return RefreshToken.findOneAndUpdate( { AccountNumber: AccountNumber }, updateToken, { new: true, upsert: true, useFindAndModify: false }, (err, data) => {
            if(err) return res.send({message: 'Refresh Token error'});
            return res.send({status: "done", message: "user logged in", accessToken: `Bearer ${accessToken}`, refreshToken: `Bearer ${refreshToken}`});
        })
    } )
}

module.exports = {
    accountNumberGenerator,
    cvcGenerator,
    creditcardExpGenerator,
    tokenGenerator
}