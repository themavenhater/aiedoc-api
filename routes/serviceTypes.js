const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate, validateService } = require("../models/serviceType");
const { ADMINS } = require("../constants/roles");

const express = require("express");
const router = express.Router();

const {
  _create,
  _read,
  _read_id,
  _addService,
  _deleteService,
  _update,
  _delete,
} = require("../controllers/serviceTypesController");

let roles = {
  CREATE: ADMINS,
  UPDATE: ADMINS,
  DELETE: ADMINS,
};

router.get("/", _read);

router.get("/:id", validateObjectId, _read_id);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to have a valid request body
 */
// CREATE
router.post("/", [auth, role(roles.CREATE), validateBody(validate)], _create);

//Add service to type
router.post(
  "/:id",
  [auth, role(roles.CREATE), validateObjectId, validateBody(validateService)],
  _addService
);

//delete service from type
router.delete(
  "/:id/services/:sid",
  [auth, role(roles.DELETE), validateObjectId],
  _deleteService
);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 * 4. to have a valid request body
 */
// UPDATE
const put_middlewares = [
  auth,
  role(roles.UPDATE),
  validateObjectId,
  validateBody(validate),
];
router.put("/:id", put_middlewares, _update);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 */
// DELETE
router.delete("/:id", [auth, role(roles.DELETE), validateObjectId], _delete);

module.exports = router;
