const router = require("express").Router();
const apiController = require("../controller/apiController");

router.get("/homepage", apiController.homePage);
router.post("/registration", apiController.register);
router.post("/login", apiController.login);
router.get("/peminjaman/:id", apiController.detail);
router.post("/peminjaman/:id/pinjam", apiController.apiPinjamBuku);

module.exports = router;
