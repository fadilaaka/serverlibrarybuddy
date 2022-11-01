const Jenis = require("../models/Jenis");
const Kategori = require("../models/Kategori");
const Anggota = require("../models/Anggota");

module.exports = {
  homePage: async (req, res) => {
    try {
      const jenis = await Jenis.find();
      const kategori = await Kategori.find()
        .populate({
          path: "idJenis",
          select: "id title",
        })
        .populate({ path: "books", select: "id title author" });
      res.status(200).json({
        jenis: jenis,
        kategori: kategori,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  register: async (req, res) => {
    try {
      const anggota = await Anggota.create({
        code: Math.floor(Math.random() * 100000000),
        username,
        password,
        name,
        telp,
        alamat,
      });
      res.status(201).json({
        message: "Succes registrasi akun",
        anggota,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
