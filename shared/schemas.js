const Joi = require("joi");

//TODO: this is a placeholder for now, we should discuss this
const createAccountSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.string()
		.regex(/^[a-zA-Z0-9]{3,30}$/)
		.required(),
});

const clientSchema = Joi.object({
	username: Joi.string().required(),
	// email: Joi.string().email({ tlds: false }),
	email: Joi.string(), // NOTE: relaxed for now to avoid errors during display
	info: Joi.object({
		name: Joi.string().required(),
		birthday: Joi.date().allow(""),
		gender: Joi.string().allow(""),
		phoneNumber: Joi.string().allow(""),
	}),
	profilePhoto: Joi.object(),
	hairDetails: Joi.object(),
	allergies: Joi.string().allow(""),
	concerns: Joi.string().allow(""),
});

module.exports = { createAccountSchema, clientSchema };
