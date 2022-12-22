const router = require("express").Router();
const adminController = require("../controller/adminController");
const { uploadSingle, uploadMultiple } = require("../middlewares/multer");
const auth = require("../middlewares/auth");

//Router Signin Logout
router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.actionSignin);
router.use(auth);
router.get("/logout", adminController.actionLogout);

//Router Dashboard
router.get("/dashboard", adminController.viewDashboard);

//Route Jenis
router.get("/jenis", adminController.viewJenis);
router.post("/jenis/add", adminController.addJenis);
router.post("/jenis/edit", adminController.editJenis);
router.post("/jenis/delete/:id", adminController.deleteJenis);

//Route Kategori
router.get("/jenis/kategori", adminController.viewKategori);
router.post("/jenis/kategori/add", adminController.addKategori);
router.post("/jenis/kategori/edit", adminController.editKategori);
router.post("/jenis/kategori/delete/:id", adminController.deleteKategori);

//Route Book
router.get("/book", adminController.viewBook);
router.post("/book/add", uploadSingle, adminController.addBook);
router.post("/book/delete/:id", uploadSingle, adminController.deleteBook);
router.get("/book/detail/:id", adminController.viewDetailBook);
router.get("/book/edit/:id", adminController.showEditBook);
router.post("/book/edit/:id", uploadSingle, adminController.editBook);

//Router Anggota
router.get("/anggota", adminController.viewAnggota);
router.post("/anggota/edit", adminController.editAnggota);
router.post("/anggota/delete/:id", adminController.deleteAnggota);

//Router Peminjaman
router.get("/peminjaman", adminController.viewPeminjaman);
router.post("/peminjaman/approve/:id", adminController.actionApprovePinjam);
router.post("/peminjaman/reject/:id", adminController.actionRejectPinjam);
router.post("/peminjaman/delete/:id", adminController.deletePeminjaman);

//Router Peminjaman
router.get("/pengembalian", adminController.viewPengembalian);
router.post(
  "/pengembalian/approve/:id",
  adminController.actionApprovePengembalian
);
router.post(
  "/pengembalian/reject/:id",
  adminController.actionRejectPengembalian
);
router.post("/pengembalian/delete/:id", adminController.deletePengembalian);

module.exports = router;
