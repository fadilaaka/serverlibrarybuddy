const Jenis = require("../models/Jenis");
const Kategori = require("../models/Kategori");
const Anggota = require("../models/Anggota");
const Book = require("../models/Book");
const Peminjaman = require("../models/Peminjaman");
const bcrypt = require("bcryptjs");
const Pengembalian = require("../models/Pengembalian");
const Admin = require("../models/Admin");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  homePage: async (req, res) => {
    try {
      const jenis = await Jenis.find().populate({
        path: "idKategori",
        select: "id title",
      });
      const kategori = await Kategori.find()
        .populate({
          path: "idJenis",
          select: "id title",
        })
        .populate({ path: "books", select: "id title author imageUrl" });
      res.status(200).json({
        jenis: jenis,
        kategori: kategori,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  register: async (req, res) => {
    console.log("Ini FILES : ", req.files);
    console.log("Ini FILE : ", req.file);
    const { username, password, name, telp, alamat } = req.body;
    if (
      username === undefined ||
      password === undefined ||
      name === undefined ||
      telp === undefined ||
      alamat === undefined
    ) {
      return res.status(404).json({ message: "Lengkapi semua field" });
    }

    if (req.file !== undefined) {
      const anggota = await Anggota.create({
        code: Math.floor(Math.random() * 100000000),
        username: username,
        password: password,
        name: name,
        telp: telp,
        alamat: alamat,
        imageUrl: `images/${req.file.filename}`,
      });
      res.status(201).json({
        message: "Succes registrasi akun",
        anggota,
      });
    } else {
      const anggota = await Anggota.create({
        code: Math.floor(Math.random() * 100000000),
        username: username,
        password: password,
        name: name,
        telp: telp,
        alamat: alamat,
        imageUrl: ``,
      });
      res.status(201).json({
        message: "Succes registrasi akun",
        anggota,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const anggota = await Anggota.findOne({ username: username });

      if (!anggota) {
        return res.status(500).json({ message: "Invalid username & password" });
      }
      const isPasswordMatch = await bcrypt.compare(password, anggota.password);
      if (!isPasswordMatch) {
        return res.status(500).json({ message: "Password doesnt match" });
      }
      res.status(200).json({
        message: "Succes login akun",
        anggota,
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error` });
    }
  },
  detail: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById({ _id: id });
      res.status(200).json({
        message: "Succes get detail buku",
        book,
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  apiPinjamBuku: async (req, res) => {
    try {
      const { idBook, idAnggota } = req.params;
      const { tanggalPengembalian } = req.body;
      const anggota = await Anggota.findOne({ _id: idAnggota });

      const peminjaman = await Peminjaman.create({
        tanggalPeminjaman: new Date(),
        tanggalPengembalian: tanggalPengembalian,
        anggota: idAnggota,
        book: idBook,
      });
      const pengembalian = await Pengembalian.create({
        tanggalPeminjaman: new Date(),
        tanggalPengembalian: tanggalPengembalian,
        anggota: idAnggota,
        book: idBook,
        waktuDikembalikan: null,
        peminjaman: peminjaman._id,
      });

      anggota.books.push({ _id: idBook });
      anggota.peminjaman.push({ _id: peminjaman._id });
      anggota.pengembalian.push({ _id: pengembalian._id });
      await anggota.save();
      res.status(201).json({ message: "Succes pinjam buku" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  apiUserId: async (req, res) => {
    try {
      const { idAnggota } = req.params;
      const anggota = await Anggota.findOne({ _id: idAnggota })
        .populate({
          path: "books",
          select: "id title imageUrl",
        })
        .populate({
          path: "peminjaman",
          select: "id tanggalPeminjaman tanggalPengembalian status book",
          populate: {
            path: "book",
          },
        })
        .populate({
          path: "pengembalian",
          select: "id tanggalPeminjaman tanggalPengembalian status book",
          populate: {
            path: "book",
          },
        });
      res.status(200).json({ message: "Success get", anggota });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },

  // Tambahan API buat REACT ADMIN
  loginAdmin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const admin = await Admin.findOne({ username: username });

      if (!admin) {
        return res.status(500).json({ message: "Invalid username & password" });
      }
      const isPasswordMatch = await bcrypt.compare(password, admin.password);
      if (!isPasswordMatch) {
        return res.status(500).json({ message: "Password doesnt match" });
      }
      res.status(200).json({
        message: "Succes login akun admin",
        admin,
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  viewJenisKategoriReact: async (req, res) => {
    try {
      const kategori = await Kategori.find().populate({
        path: "idJenis",
        select: "id title",
      });
      const jenis = await Jenis.find().populate({
        path: "idKategori",
        select: "id title",
      });
      res.status(200).json({
        kategori: kategori,
        jenis: jenis,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  viewAdminBookReact: async (req, res) => {
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
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  addBookReact: async (req, res) => {
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
      res.status(201).json({ message: "Succes Tambah Buku" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  detailBookReact: async (req, res) => {
    try {
      const { idBuku } = req.params;
      const book = await Book.findOne({ _id: idBuku }).populate({
        path: "idKategori",
        select: "id title idJenis",
        populate: { path: "idJenis", select: "id title" },
      });
      res.status(200).json({ book });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  editBookReact: async (req, res) => {
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
      console.log("ini title :", updateTitle);
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
      res.status(201).json({ message: "Succes Edit Buku" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
    }
  },
  deleteBookReact: async (req, res) => {
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
      res.status(201).json({ message: "Succes Delete Buku" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  viewDashboard: async (req, res) => {
    try {
      const jenis = await Jenis.find();
      const kategori = await Kategori.find();
      const book = await Book.find();
      const anggota = await Anggota.find();
      const peminjaman = await Peminjaman.find();
      const pengembalian = await Pengembalian.find();
      res.status(200).json({
        jenis: jenis.length,
        kategori: kategori.length,
        book: book.length,
        anggota: anggota.length,
        peminjaman: peminjaman.length,
        pengembalian: pengembalian.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  addJenisReact: async (req, res) => {
    try {
      const { title } = req.body;
      await Jenis.create({ title });
      res.status(201).json({
        message: "Berhasil Menambahkan Jenis",
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error:${error}` });
    }
  },

  deleteJenis: async (req, res) => {
    try {
      const { id } = req.params;
      await Jenis.findOne({ _id: id }).remove();
      res.status(201).json({
        message: "Berhasil detele jenis",
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error:${error}` });
    }
  },

  editJenisReact: async (req, res) => {
    try {
      const { title } = req.body;
      const { id } = req.params;
      await Jenis.findByIdAndUpdate(
        { _id: id },
        {
          title: title,
        }
      );
      res.status(201).json({
        message: "Berhasil edit jenis",
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error:${error}` });
    }
  },

  detailJenis: async (req, res) => {
    try {
      const { id } = req.params;
      const jenis = await Jenis.findById({ _id: id });
      res.status(200).json({
        message: "Succes get detail jenis",
        jenis,
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  addKategoriReact: async (req, res) => {
    try {
      const { title, idJenis } = req.body;
      const newKategory = { title, idJenis };
      const kategori = await Kategori.create(newKategory);
      const jenis = await Jenis.findOne({ _id: idJenis });
      jenis.idKategori.push({ _id: kategori._id });
      await jenis.save();
      res.status(201).json({
        message: "Succes add kategori",
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  deleteKategoriReact: async (req, res) => {
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
      res.status(201).json({ message: "Success delete kategori" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  detailKategori: async (req, res) => {
    try {
      const { id } = req.params;
      const kategori = await Kategori.findById({ _id: id }).populate({
        path: "idJenis",
        select: "id title",
      });
      res.status(200).json({
        message: "Succes get detail kategori",
        kategori,
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  editKategoriReact: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, idJenis } = req.body;
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
      res.status(201).json({
        message: "Success Edit kategori",
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  viewPeminjamanReact: async (req, res) => {
    try {
      const peminjaman = await Peminjaman.find()
        .populate({
          path: "anggota",
          select: "id name",
        })
        .populate({ path: "book", select: "id title" });
      res.status(200).json({
        peminjaman,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  approvePeminjaman: async (req, res) => {
    const { id } = req.params;
    try {
      await Peminjaman.findOneAndUpdate(
        { _id: id },
        {
          status: "sudah disetujui",
        }
      );
      res.status(201).json({ message: "Success Approve Peminjaman" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
    }
  },
  rejectPeminjaman: async (req, res) => {
    const { id } = req.params;
    try {
      await Peminjaman.findOneAndUpdate(
        { _id: id },
        {
          status: "tidak disetujui",
        }
      );
      res.status(201).json({ message: "Success Approve Peminjaman" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
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
      res.status(201).json({ message: "Success Hapus Peminjaman" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
    }
  },
  viewPengembalianReact: async (req, res) => {
    try {
      const pengembalian = await Pengembalian.find()
        .populate({
          path: "anggota",
          select: "id name",
        })
        .populate({ path: "book", select: "id title" });
      res.status(200).json({
        pengembalian,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  approvePengembalian: async (req, res) => {
    const { idPengembalian } = req.params;
    try {
      const pengembalian = await Pengembalian.findOneAndUpdate(
        { _id: idPengembalian },
        {
          status: "sudah dikembalikan",
          waktuDikembalikan: new Date(),
        }
      );
      await Anggota.findByIdAndUpdate(
        { _id: pengembalian.anggota },
        {
          $pull: {
            peminjaman: pengembalian.peminjaman,
          },
        },
        { new: true }
      );
      res.status(201).json({ message: "Success Approve Pengembalian" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
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
      res.status(201).json({ message: "Success Hapus Pengembalian" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
    }
  },
  viewAnggotaReact: async (req, res) => {
    try {
      const anggota = await Anggota.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.status(200).json({
        anggota,
      });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
    }
  },
  editAnggotaReact: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, telp, alamat, username, password } = req.body;
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
      res.status(201).json({ message: "Success Edit Anggota" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
    }
  },
  deleteAnggotaReact: async (req, res) => {
    try {
      const { id } = req.params;
      const anggota = await Anggota.findOne({ _id: id });
      if (anggota.imageUrl !== "") {
        await fs.unlink(path.join(`public/${anggota.imageUrl}`));
      }
      await anggota.remove();
      res.status(201).json({ message: "Success hapus anggota" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error : ${error}` });
    }
  },
};
