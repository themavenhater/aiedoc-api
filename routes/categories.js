const auth = require("../middlewares/auth");
const role = require("../middlewares/role");
const validateBody = require("../middlewares/validateBody");
const validateObjectId = require("../middlewares/validateObjectId");
const { validate, validateUpdate, Category } = require("../models/category");
const { STORE } = require("../constants/roles");
const { categoryStorage } = require("../controllers/storageController");
const { multerErrorHandler } = require("../middlewares/multerErrorHandler");
const { image } = require("../middlewares/files");
const { documentExists } = require("../middlewares/documentExists");
const express = require("express");
const router = express.Router();

const {
  _create,
  _read,
  _read_id,
  _update,
  _update_image,
  _delete,
} = require("../controllers/categoriesController");

let roles = {
  CREATE: STORE,
  UPDATE: STORE,
  DELETE: STORE,
};

/**
 * 1. Add predefined values for level in model
 */

router.get("/", auth, _read);

router.get("/:id", auth, validateObjectId, _read_id);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to have a valid request body
 */
// CREATE
router.post(
  "/",
  [
    auth,
    role(roles.CREATE),
    multerErrorHandler(categoryStorage.array("image", 1)),
    image(false),
    validateBody(validate),
  ],
  _create
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
  validateBody(validateUpdate),
];
router.put("/:id", put_middlewares, _update);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 * 4. verify that service exists before saving the image
 * 5. to have a valid request body
 */
// UPDATE IMAGE
const put_image_middlewares = [
  auth,
  role(roles.UPDATE),
  validateObjectId,
  documentExists(Category),
  multerErrorHandler(categoryStorage.single("image")),
  image(),
];
router.put("/:id/image", put_image_middlewares, _update_image);

/*
 * The user needs
 * 1. to be authenticated
 * 2. to be allowed to do the specified action (role)
 * 3. to provide a valid object Id as a param
 */
// DELETE
router.delete("/:id", [auth, role(roles.DELETE), validateObjectId], _delete);

module.exports = router;
