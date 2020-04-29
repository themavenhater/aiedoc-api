const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");
const location = require("./location");
const {
  WILAYAS,
  STATES,
  NOT_READY,
  STATUSES,
  NOT_VALIDATED,
  DIPLOMAS,
} = require("../constants/serviceProvider");

const spSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      validate: {
        validator: function (v) {
          return /\+\d{12}/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: [true, "User phone number required"],
    },
    firstname: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    lastname: {
      type: String,
      minlength: 2,
      maxlength: 50,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    birthdate: { type: Date, required: true },
    wilaya: { type: String, enum: WILAYAS, required: true },
    commune: { type: String, required: true },
    jobTitle: { type: String, maxlength: 255, required: true },
    description: { type: String, maxlength: 255 },
    balance: { type: Number, default: 0 },
    amountToPay: { type: Number, default: 0 },
    location: { type: location },
    rating: { type: Number, min: 0, max: 5 },
    services: [String],
    picture: String,
    diplomas: {
      type: [
        {
          type: {
            type: String,
            enum: DIPLOMAS,
          },
          description: {
            type: String,
            maxlength: 255,
          },
          file: {
            type: String,
          },
        },
      ],
      required: true,
    },
    PercentToPay: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    state: {
      type: String,
      enum: STATES,
      default: NOT_READY,
    },
    status: {
      type: String,
      enum: STATUSES,
      default: NOT_VALIDATED,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    interventions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Intervention",
      },
    ],
    commands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Command",
      },
    ],
    payments: [{ date: Date, amount: Number }],
  },
  {
    timestamps: true,
  }
);

spSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, roles: ["sp"] },
    config.get("jwtPrivateKey")
  );
};

const ServiceProvider = mongoose.model("ServiceProvider", spSchema);

function validateSP(sp) {
  const schema = {
    phone: Joi.string()
      .regex(/\+\d{12}/)
      .required(),
    firstname: Joi.string().min(2).max(50).required(),
    lastname: Joi.string().min(2).max(50).required(),
    gender: Joi.string().valid("male", "female").required(),
    jobTitle: Joi.string().max(255).required(),
    rating: Joi.number().min(0).max(5),
    birthdate: Joi.date().required(),
    picture: Joi.string(),
    email: Joi.string().email(),
    wilaya: Joi.string()
      .valid(...WILAYAS)
      .required(),
    commune: Joi.string().required(),
    // diplomas: Joi.array().required(),
    types: Joi.array().items(Joi.string().valid(DIPLOMAS)),
    descriptions: Joi.array().items(Joi.string().max(255)),
    files: Joi.array().items(Joi.object()),
    services: Joi.array(),
    description: Joi.string().max(255),
  };

  return Joi.validate(sp, schema);
}

function validatePhone(phone) {
  const schema = {
    phone: Joi.string()
      .regex(/\+\d{12}/)
      .required(),
  };

  return Joi.validate(phone, schema);
}

exports.ServiceProvider = ServiceProvider;
exports.validate = validateSP;
exports.validatePhone = validatePhone;
