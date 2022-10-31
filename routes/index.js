const router = require("express").Router();

// HomePage
router.get("/", (req, res) => {
  res.redirect("/admin/signin");
});

module.exports = router;
