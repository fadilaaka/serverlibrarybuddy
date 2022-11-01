const Jenis = require("../models/Jenis");
const Kategori = require("../models/Kategori");
const Anggota = require("../models/Anggota");
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
        return res.status(500).json({ message: "Username tidak ada" });
      }
      const isPasswordMatch = await bcrypt.compare(password, anggota.password);
      if (!isPasswordMatch) {
        return res.status(500).json({ message: "Password tidak cocok" });
      }
      res.status(200).json({
        message: "Succes registrasi akun",
        anggota,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  // peminjaman: async (req, res) => {
  //   const { id } = req.params;
  //   const anggota = await Anggota.find();
  //   const { tanggalPengembalian } = req.body;
  //   if (
  //     username === undefined ||
  //     password === undefined ||
  //     name === undefined ||
  //     telp === undefined ||
  //     alamat === undefined
  //   ) {
  //     return res.status(404).json({ message: "Lengkapi semua form" });
  //   }

  //   res.status(201).json({
  //     message: "Succes request peminjaman",
  //   });
  // },
};
