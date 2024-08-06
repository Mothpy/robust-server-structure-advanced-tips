// Create a new Express router instance with the mergeParams option set to true.
// This allows the router to access parameters from its parent router.
const router = require("express").Router({ mergeParams: true });

// import controller file 
const controller = require("./pastes.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

// route for pasteId
router.route("/:pasteId")
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);

// route for pastes list 
router.route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

module.exports = router;
