const router = require("express").Router();
const controller = require("./users.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const pastesRouter = require("../pastes/pastes.router");

router.use("/:userId/pastes", controller.userExists, pastesRouter);

// userId route 
router.route("/:userId")
    .get(controller.read)
    .all(methodNotAllowed);

// list route 
router.route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;