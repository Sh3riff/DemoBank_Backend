const Joi = require('@hapi/joi');

const registerationValidation = async ( data ) => {
    const schema = Joi.object( {
        lastname: Joi.string().required(),
        firstname: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.number().required(),
        password: Joi.string().min(6).required(),
        password2: Joi.ref('password')
    } );
    return  schema.validateAsync(data)
};

const loginValidation = async ( data ) => {
    const schema = Joi.object( {
        email: Joi.string()
            .email()
            .required(),
        password: Joi.string()
            .min(6)
            .required(),
    } );

    return schema.validateAsync(data)
};

module.exports = {
    registerationValidation,
    loginValidation
};