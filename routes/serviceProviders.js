const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const paramsToBody = require("../middlewares/paramsToBody");
const validateObjectId = require("../middlewares/validateObjectId");
const validateBody = require("../middlewares/validateBody");
const { validate, validatePhone } = require("../models/serviceProvider");
const validatePayment = require("../models/payment")["validate"];
const express = require("express");
const router = express.Router();
const { ADMINS, CLIENT, SP } = require("../constants/roles");
const { spStorage } = require("../controllers/storageController");
const { picture, docs, setFilePath } = require("../middlewares/files");
const { parseJson } = require("../middlewares/parseJson");
const { multerErrorHandler } = require("../middlewares/multerErrorHandler");

const {
  _create,
  _read_id,
  _read,
  _read_me_balance,
  _read_available,
  _verifyPhone,
  _validate,
  _set_state,
  _ban,
  _interventions,
  _commands,
  _payments,
  _add_payment,
  _set_services,
  _set_profile_picture,
  _set_percentToPay,
  _closestEmergencyReady,
} = require("../controllers/serviceProvidersController");

let roles = {
  GET_ALL: ADMINS,
  GET_AVAILABLE: [CLIENT],
  GET_ONE: ADMINS,
  GET_ONE_INTERVENTIONS: [...ADMINS, SP],
  GET_ONE_COMMANDS: [...ADMINS, SP],
  GET_ONE_PAYMENTS: ADMINS,
  GET_ME: [SP],
  VALIDATE: ADMINS,
  PUT_STATE: [SP],
  BAN: ADMINS,
  POST_ONE_PAYMENT: ADMINS,
  PUT_ONE_SERVICES: [SP],
  PUT_ONE_PICTURE: [SP],
};

// Register route
router.post(
  "/register",
  multerErrorHandler(
    spStorage.fields([
      { name: "picture", maxCount: 1 },
      { name: "extNaissance", maxCount: 1 },
      { name: "residence", maxCount: 1 },
      { name: "idCard", maxCount: 1 },
      { name: "casierJudiciaire", maxCount: 1 },
      { name: "docs" },
    ])
  ),
  setFilePath(
    "picture",
    "extNaissance",
    "residence",
    "idCard",
    "casierJudiciaire"
  ),
  parseJson("types", "descriptions", "services"),
  docs, // uses types & descriptions which need to be parsed first
  validateBody(validate),
  _create
);

router.put(
  "/:id/picture",
  auth,
  role(roles.PUT_ONE_PICTURE),
  validateObjectId,
  multerErrorHandler(spStorage.fields([{ name: "picture", maxCount: 1 }])),
  picture,
  _set_profile_picture
);

// Verify if user is already registered via phone number
// add body validation middleware
router.post("/verifyPhone", validateBody(validatePhone), _verifyPhone);

router.post("/closest", _closestEmergencyReady);

// GET_ALL
router.get("/", auth, role(roles.GET_ALL), _read);

// GET ME
router.get("/me/balance", auth, role(roles.GET_ME), _read_me_balance);

// GET_AVAILABLE
router.get("/available", auth, role(roles.GET_AVAILABLE), _read_available);

// router.get("/me", auth, _read_id);

// GET_ONE
router.get("/:id", auth, role(roles.GET_ONE), validateObjectId, _read_id);

// GET_ONE_INTERVENTIONS
router.get(
  "/:id/interventions",
  auth,
  role(roles.GET_ONE_INTERVENTIONS),
  validateObjectId,
  _interventions
);

// GET_ONE_INTERVENTIONS
router.get(
  "/:id/commands",
  auth,
  role(roles.GET_ONE_COMMANDS),
  validateObjectId,
  _commands
);

// GET_ONE_PAYMENTS
router.get(
  "/:id/payments",
  auth,
  role(roles.GET_ONE_PAYMENTS),
  validateObjectId,
  _payments
);

// POST_ONE_PAYMENT
router.post(
  "/:id/payments",
  auth,
  role(roles.POST_ONE_PAYMENT),
  validateObjectId,
  paramsToBody({ id: "sp_id" }),
  validateBody(validatePayment),
  _add_payment
);

// VALIDATE
router.put(
  "/:id/validate",
  auth,
  role(roles.VALIDATE),
  validateObjectId,
  _validate
);

// PercentToPay
router.put(
  "/:id/percentToPay",
  auth,
  role(roles.VALIDATE),
  validateObjectId,
  _set_percentToPay
);

router.put(
  "/:id/state",
  auth,
  role(roles.PUT_STATE),
  validateObjectId,
  _set_state
);

router.put(
  "/:id/services",
  auth,
  role(roles.PUT_ONE_SERVICES),
  validateObjectId,
  _set_services
);

// BAN
router.put("/:id/ban", auth, role(roles.BAN), validateObjectId, _ban);

module.exports = router;
