const Admin = require("../models/Admin");
const Jenis = require("../models/Jenis");
const Kategori = require("../models/Kategori");
const Book = require("../models/Book");
const Anggota = require("../models/Anggota");
const Peminjaman = require("../models/Peminjaman");
const Pengembalian = require("../models/Pengembalian");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");

const menu = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: "bi-house-door",
  },
  {
    name: "Jenis & Kategori",
    url: "/jenis",
    icon: "bi-journal-bookmark",
  },
  {
    name: "List Buku",
    url: "/book",
    icon: "bi-journal-album",
  },
  {
    name: "Anggota Perpustakaan",
    url: "/anggota",
    icon: "bi-people",
  },
  {
    name: "Peminjaman",
    url: "/peminjaman",
    icon: "bi-book",
  },
  {
    name: "Pengembalian",
    url: "/pengembalian",
    icon: "bi-bag-check",
  },
];

const tabsJenisKategori = [
  { name: "Jenis Buku", url: "/jenis" },
  { name: "Kategori Buku", url: "/jenis/kategori" },
];

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          alert,
          title: "Library Buddy | Login",
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username: username });
      if (!admin) {
        req.flash("alertMessage", "User tidak ada.");
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/signin");
      }
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (!isPasswordMatch) {
        req.flash("alertMessage", "Password yang tidak cocok");
        req.flash("alertStatus", "danger");
        return res.redirect("/admin/signin");
      }
      req.session.user = {
        id: admin.id,
        username: admin.username,
      };
      res.redirect("/admin/dashboard");
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },
  actionLogout: async (req, res) => {
    req.session.destroy(() => {
      req.session = null;
      res.redirect("/admin/signin");
    });
  },
  viewDashboard: async (req, res) => {
    try {
      const jenis = await Jenis.find();
      const kategori = await Kategori.find();
      const book = await Book.find();
      const anggota = await Anggota.find();
      const peminjaman = await Peminjaman.find();
      res.render("admin/dashboard/view_dashboard", {
        title: "Library Buddy | Dashboard",
        url: req.url,
        menu: menu,
        jenis: jenis.length,
        kategori: kategori.length,
        book: book.length,
        anggota: anggota.length,
        peminjaman: peminjaman.length,
      });
    } catch (error) {
      res.redirect("/admin/dashboard");
    }
  },
  viewJenis: async (req, res) => {
    try {
      const jenis = await Jenis.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/jenis/view_jenis", {
        title: "Library Buddy | Jenis Buku",
        alert,
        url: req.url,
        tabsJenisKategori,
        menu,
        jenis,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/jenis");
    }
  },
  addJenis: async (req, res) => {
    try {
      const { title } = req.body;
      await Jenis.create({ title });
      req.flash("alertMessage", "Success add jenis buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/jenis");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/jenis");
    }
  },
  editJenis: async (req, res) => {
    try {
      const { id, title } = req.body;
      await Jenis.findByIdAndUpdate(
        { _id: id },
        {
          title: title,
        }
      );
      req.flash("alertMessage", "Success edit jenis buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/jenis");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/jenis");
    }
  },
  deleteJenis: async (req, res) => {
    try {
      const { id } = req.params;
      await Jenis.findOne({ _id: id }).remove();
      req.flash("alertMessage", "Success delete jenis buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/jenis");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/jenis");
    }
  },
  viewKategori: async (req, res) => {
    try {
      const jenis = await Jenis.find();
      const kategori = await Kategori.find().populate({
        path: "idJenis",
        select: "id title",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/kategori/view_kategori", {
        title: "Library Buddy | Kategori Buku",
        alert,
        url: req.url,
        tabsJenisKategori,
        menu,
        jenis,
        kategori,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/jenis/kategori");
    }
  },
  addKategori: async (req, res) => {
    try {
      const { title, idJenis } = req.body;
      const newKategory = { title, idJenis };
      const kategori = await Kategori.create(newKategory);
      const jenis = await Jenis.findOne({ _id: idJenis });
      jenis.idKategori.push({ _id: kategori._id });
      await jenis.save();
      req.flash("alertMessage", "Success add kategori buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/jenis/kategori");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/jenis/kategori");
    }
  },
  editKategori: async (req, res) => {
    try {
      const { id, title, idJenis } = req.body;
      const kategori = await Kategori.findOne({ _id: id });
      await Jenis.findOneAndUpdate(
        {
          _id: kategori.idJenis,
        },
        {
          $pull: {
            idKategori: id,
          },
        }
      );
      await Jenis.findOneAndUpdate(
        {
          _id: idJenis,
        },
        {
          $push: {
            idKategori: kategori._id,
          },
        }
      );
      kategori.title = title;
      kategori.idJenis = idJenis;
      await kategori.save();
      req.flash("alertMessage", "Success edit kategori buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/jenis/kategori");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/jenis/kategori");
    }
  },
  deleteKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const kategori = await Kategori.findOne({ _id: id });
      await Jenis.findByIdAndUpdate(
        { _id: kategori.idJenis },
        {
          $pull: { idKategori: id },
        },
        { new: true }
      );
      await kategori.remove();
      req.flash("alertMessage", "Success delete kategori buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/jenis/kategori");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/jenis/kategori");
    }
  },

  viewBook: async (req, res) => {
    try {
      const book = await Book.find().populate({
        path: "idKategori",
        select: "id title idJenis",
        populate: { path: "idJenis", select: "id title" },
      });
      const kategori = await Kategori.find().populate({
        path: "idJenis",
        select: "id title",
      });
      const jenis = await Jenis.find().populate({
        path: "idKategori",
        select: "id title",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/book/view_book", {
        title: "Library Buddy | List Buku",
        alert,
        url: req.url,
        menu,
        book,
        jenis,
        kategori,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  addBook: async (req, res) => {
    try {
      const {
        title,
        author,
        publisher,
        publishDate,
        isbn,
        pageCount,
        description,
        idKategori,
      } = req.body;
      const book = await Book.create({
        title,
        author,
        publisher,
        publishDate,
        isbn,
        imageUrl: `images/${req.file.filename}`,
        pageCount,
        description,
        idKategori,
      });
      const kategori = await Kategori.findOne({ _id: idKategori });
      kategori.books.push({ _id: book._id });
      await kategori.save();
      req.flash("alertMessage", "Success add buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/book");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  showEditBook: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findOne({ _id: id }).populate({
        path: "idKategori",
        select: "id title",
      });
      const kategori = await Kategori.find().populate({
        path: "idJenis",
        select: "id title",
      });
      const jenis = await Jenis.find().populate({
        path: "idKategori",
        select: "id title",
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/book/show_edit", {
        title: "Library Buddy | Edit Buku",
        alert,
        url: req.url,
        menu,
        book,
        jenis,
        kategori,
        action: "edit",
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  editBook: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        updateTitle,
        updateAuthor,
        updatePublisher,
        updatePublishDate,
        updateIsbn,
        updatePageCount,
        updateDescription,
        updateIdKategori,
      } = req.body;
      const book = await Book.findOne({ _id: id }).populate({
        path: "idKategori",
        select: "id title",
      });
      await Kategori.findOneAndUpdate(
        {
          _id: book.idKategori._id,
        },
        {
          $pull: {
            books: id,
          },
        }
      );
      await Kategori.findOneAndUpdate(
        {
          _id: updateIdKategori,
        },
        {
          $push: {
            books: id,
          },
        }
      );
      book.title = updateTitle;
      book.author = updateAuthor;
      book.publisher = updatePublisher;
      book.publishDate = updatePublishDate;
      book.isbn = updateIsbn;
      book.pageCount = updatePageCount;
      book.description = updateDescription;
      book.idKategori = updateIdKategori;
      await book.save();
      req.flash("alertMessage", "Success edit buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/book");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  deleteBook: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findOne({ _id: id });
      await fs.unlink(path.join(`public/${book.imageUrl}`));
      await Kategori.findByIdAndUpdate(
        { _id: book.idKategori },
        {
          $pull: { books: id },
        },
        { new: true }
      );
      await book.remove();
      req.flash("alertMessage", "Success delete buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/book");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  viewDetailBook: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findOne({ _id: id }).populate({
        path: "idKategori",
        select: "id title idJenis",
        populate: { path: "idJenis", select: "id title" },
      });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/book/show_detail", {
        title: "Library Buddy | Detail Buku",
        alert,
        url: req.url,
        menu,
        book,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },

  viewAnggota: async (req, res) => {
    try {
      const anggota = await Anggota.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/anggota/view_anggota", {
        title: "Library Buddy | Anggota",
        alert,
        url: req.url,
        menu: menu,
        anggota,
      });
    } catch (error) {
      res.redirect("/admin/anggota");
    }
  },
  editAnggota: async (req, res) => {
    try {
      const { id, name, telp, alamat, username, password } = req.body;
      const anggota = await Anggota.findOne({ _id: id });
      const isPasswordMatch = await bcrypt.compare(password, anggota.password);
      if (!isPasswordMatch) {
        anggota.name = name;
        anggota.telp = telp;
        anggota.alamat = alamat;
        anggota.username = username;
        anggota.password = password;
      } else {
        anggota.name = name;
        anggota.telp = telp;
        anggota.alamat = alamat;
        anggota.username = username;
      }
      await anggota.save();
      req.flash("alertMessage", "Success edit anggota");
      req.flash("alertStatus", "success");
      res.redirect("/admin/anggota");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/anggota");
    }
  },
  deleteAnggota: async (req, res) => {
    try {
      const { id } = req.params;
      const anggota = await Anggota.findOne({ _id: id });
      await anggota.remove();
      req.flash("alertMessage", "Success delete anggota");
      req.flash("alertStatus", "success");
      res.redirect("/admin/anggota");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/anggota");
    }
  },

  viewPeminjaman: async (req, res) => {
    try {
      const peminjaman = await Peminjaman.find()
        .populate({
          path: "anggota",
          select: "id name",
        })
        .populate({ path: "book", select: "id title" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/peminjaman/view_peminjaman", {
        title: "Library Buddy | Peminjaman",
        alert,
        url: req.url,
        menu: menu,
        peminjaman,
      });
    } catch (error) {
      res.redirect("/admin/peminjaman");
    }
  },
  actionApprovePinjam: async (req, res) => {
    const { id } = req.params;
    try {
      await Peminjaman.findOneAndUpdate(
        { _id: id },
        {
          status: "sudah disetujui",
        }
      );
      req.flash("alertMessage", "Success konfirmasi peminjaman buku");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/peminjaman`);
    } catch (error) {
      res.redirect(`/admin/peminjaman`);
    }
  },
  actionRejectPinjam: async (req, res) => {
    const { id } = req.params;
    try {
      await Peminjaman.findOneAndUpdate(
        { _id: id },
        {
          status: "tidak disetujui",
        }
      );
      req.flash("alertMessage", "Peminjaman buku tidak disetujui");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/peminjaman`);
    } catch (error) {
      res.redirect(`/admin/peminjaman`);
    }
  },
  deletePeminjaman: async (req, res) => {
    try {
      const { id } = req.params;
      const peminjaman = await Peminjaman.findOne({ _id: id });
      await Anggota.findByIdAndUpdate(
        { _id: peminjaman.anggota },
        {
          $pull: {
            peminjaman: id,
          },
        },
        { new: true }
      );
      await peminjaman.remove();
      req.flash("alertMessage", "Success delete peminjaman");
      req.flash("alertStatus", "success");
      res.redirect("/admin/peminjaman");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/peminjaman");
    }
  },

  viewPengembalian: async (req, res) => {
    try {
      const pengembalian = await Pengembalian.find()
        .populate({
          path: "anggota",
          select: "id name",
        })
        .populate({ path: "book", select: "id title" });
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/pengembalian/view_pengembalian", {
        title: "Library Buddy | Pengembalian",
        alert,
        url: req.url,
        menu: menu,
        pengembalian,
      });
    } catch (error) {
      res.redirect("/admin/pengembalian");
    }
  },
  actionApprovePengembalian: async (req, res) => {
    const { id } = req.params;
    try {
      await Pengembalian.findOneAndUpdate(
        { _id: id },
        {
          status: "sudah dikembalikan",
          waktuDikembalikan: new Date(),
        }
      );
      req.flash("alertMessage", "Success konfirmasi pengembalian buku");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/pengembalian`);
    } catch (error) {
      res.redirect(`/admin/pengembalian`);
    }
  },
  actionRejectPengembalian: async (req, res) => {
    const { id } = req.params;
    try {
      await Pengembalian.findOneAndUpdate(
        { _id: id },
        {
          status: "belum dikembalikan",
        }
      );
      req.flash("alertMessage", "Pengembalian buku belum dikembalikan");
      req.flash("alertStatus", "success");
      res.redirect(`/admin/pengembalian`);
    } catch (error) {
      res.redirect(`/admin/pengembalian`);
    }
  },
  deletePengembalian: async (req, res) => {
    try {
      const { id } = req.params;
      const pengembalian = await Pengembalian.findOne({ _id: id });
      await Anggota.findByIdAndUpdate(
        { _id: pengembalian.anggota },
        {
          $pull: {
            pengembalian: id,
          },
        },
        { new: true }
      );
      await pengembalian.remove();
      req.flash("alertMessage", "Success delete pengembalian");
      req.flash("alertStatus", "success");
      res.redirect("/admin/pengembalian");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/pengembalian");
    }
  },
};
