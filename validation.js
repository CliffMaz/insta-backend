import Joi from "@hapi/joi";

const registerValidation = data => {

    const schema = Joi.object( {
        fullName: Joi.string().min(3).max(255).required(),
        username: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(6).max(100).required().email(),
        password: Joi.string().min(6).required()
    });
return schema.validate(data);

}

 const loginValidation = data => {

    const schema = Joi.object({
        
        email: Joi.string().min(6).max(100).required().email(),
        password: Joi.string().min(6).required()
    });
return schema.validate(data);;

}

export {registerValidation, loginValidation};