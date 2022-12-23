const router = require("express").Router();
const apiController = require("../controller/apiController");
const { uploadSingle } = require("../middlewares/multer");

router.get("/homepage", apiController.homePage);
router.post("/registration", uploadSingle, apiController.register);
router.post("/login", apiController.login);
router.get("/peminjaman/:id", apiController.detail);
router.post(
  "/peminjaman/:idBook/:idAnggota/pinjam",
  apiController.apiPinjamBuku
);
router.get("/list-peminjaman/:idAnggota", apiController.apiUserId);

// Tambahan API buat REACT ADMIN
router.post("/login-admin", apiController.loginAdmin);

// Ini buat ngolah jenis kategori
router.get("/jenis-kategori", apiController.viewJenisKategoriReact);
router.get("/detail-jenis/:id", apiController.detailJenis);
router.get("/detail-kategori/:id", apiController.detailKategori);
router.post("/add-jenis", apiController.addJenisReact);
router.post("/delete-jenis/:id", apiController.deleteJenis);
router.post("/edit-jenis/:id", apiController.editJenisReact);
router.post("/add-kategori", apiController.addKategoriReact);
router.post("/delete-kategori/:id", apiController.deleteKategoriReact);
router.post("/edit-kategori/:id", apiController.editKategoriReact);

// Ini buat Pengolahan buku
router.get("/book", apiController.viewAdminBookReact);
router.post("/add-buku", uploadSingle, apiController.addBookReact);
router.get("/detail-buku/:idBuku", apiController.detailBookReact);
router.post("/edit-buku/:id", apiController.editBookReact);
router.post("/delete-buku/:id", uploadSingle, apiController.deleteBookReact);

// Ini buat Peminjaman Buku
router.get("/peminjaman", apiController.viewPeminjamanReact);

// Ini buat Dashboard
router.get("/dashboard", apiController.viewDashboard);

module.exports = router;
