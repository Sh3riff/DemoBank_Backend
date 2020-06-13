const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/refreshtoken');

module.exports = async (token, req, res) => {
    // if(!token) return res.send("no refresh token");

    // await RefreshToken.findOne( { Token: [token]}, async (err, token) => {
        // if(err) return res.send('Refresh Token error')
        // if(!token) return res.send('Refresh Token not in database...')
        // const userEmail = token.email;
        // let newAccessToken = "";
        // let newRefreshToken = "";

        // try {
        //     newAccessToken = jwt.sign( { email: userEmail}, process.env.JWT_ACCESS_TOKEN, {expiresIn: '2h'} );             
        // } catch (err) {
        //     return res.send(err)
        // }

        // const saveNewRefreshToken ={
        //     email: userEmail,
        //     token: newRefreshToken
        // };

        // await Token.findOneAndUpdate( { email: userEmail }, saveNewRefreshToken, { new: true, upsert: true, useFindAndModify: false }, async (err, data) => {
        //     if(err) return res.send('Refresh Token update error')
        //     // if(err) return res.sendStatus(500)
        //     await jwt.verify(newAccessToken, process.env.JWT_ACCESS_TOKEN, async (err, user) => {
        //         if(err)  return res.send(err)
        //         req.user = user
        //     })
        //     return res.set('Authorization', `Bearer ${newAccessToken}`).set('Auth-Refresh', `Bearer ${newRefreshToken}`).end();
        // })
            
    // })
}