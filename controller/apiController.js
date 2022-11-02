const Jenis = require("../models/Jenis");
const Kategori = require("../models/Kategori");
const Anggota = require("../models/Anggota");
const Book = require("../models/Book");
const Peminjaman = require("../models/Peminjaman");
const bcrypt = require("bcryptjs");

module.exports = {
  homePage: async (req, res) => {
    try {
      const jenis = await Jenis.find();
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

    const anggota = await Anggota.create({
      code: Math.floor(Math.random() * 100000000),
      username: username,
      password: password,
      name: name,
      telp: telp,
      alamat: alamat,
    });
    res.status(201).json({
      message: "Succes registrasi akun",
      anggota,
    });
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
        message: "Succes registrasi akun",
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
        message: "Succes registrasi akun",
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
      anggota.books.push({ _id: idBook });
      anggota.peminjaman.push({ _id: peminjaman._id });
      await anggota.save();
      res.status(201).json({ message: "Succes pinjam buku" });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
  apiUserId: async (req, res) => {
    try {
      const { idAnggota } = req.params;
      const anggota = await Anggota.findOne({ _id: idAnggota }).populate({
        path: "books",
        select: "id title author description",
      });
      res.status(200).json({ message: "Success get", anggota });
    } catch (error) {
      res.status(500).json({ message: `Internal Server Error: ${error}` });
    }
  },
};
