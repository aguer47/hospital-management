const Joi = require("joi");

// What an appointment needs to have
const schema = Joi.object({
  patientId: Joi.string().required(),
  doctorId: Joi.string().required(),
  date: Joi.string().required(),
  time: Joi.string().required(),
  reason: Joi.string().required()
});

module.exports = (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: error.details[0].message
    });
  }

  next();
};
