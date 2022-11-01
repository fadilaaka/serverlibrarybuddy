const router = require("express").Router();
const apiController = require("../controller/apiController");

router.get("/homepage", apiController.homePage);
router.post("/registration", apiController.register);
// router.post("/peminjaman/:id", apiController);

module.exports = router;
