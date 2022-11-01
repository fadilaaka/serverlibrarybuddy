const router = require("express").Router();
const apiController = require("../controller/apiController");

router.get("/homepage", apiController.homePage);
router.post("/registration", apiController.register);

module.exports = router;
