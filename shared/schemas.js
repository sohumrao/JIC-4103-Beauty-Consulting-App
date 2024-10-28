const Joi = require("joi");

//TODO: this is a placeholder for now, we should discuss this
const createAccountSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.string()
		.regex(/^[a-zA-Z0-9]{3,30}$/)
		.required(),
});

module.exports = { createAccountSchema };
