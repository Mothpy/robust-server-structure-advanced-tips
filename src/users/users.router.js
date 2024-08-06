
const router = require("express").Router();
const controller = require("./users.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const pastesRouter = require("../pastes/pastes.router");

router.use("/:userId/pastes", controller.userExists, pastesRouter);

// route for a specific user by userId
router.route("/:userId")
    .get(controller.read)
    .all(methodNotAllowed);

// route for a list of all users
router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;